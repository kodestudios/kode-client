import { useEffect, useRef, useState } from "react";
import { useKeymapStore } from "../stores/keymap-store";
import { evaluateWhenClause } from "../utils/context";
import { eventToKey, matchKeybinding } from "../utils/matcher";
import type { ParsedKey } from "../utils/parser";
import { keymapRegistry } from "../utils/registry";

const CHORD_TIMEOUT_MS = 1000;

/**
 * Mount once at the app root. Installs a single capture-phase `keydown`
 * listener that dispatches matched bindings through `keymapRegistry`.
 */
export function useKeymaps() {
    const contexts = useKeymapStore((state) => state.contexts);
    const userKeybindings = useKeymapStore((state) => state.keybindings);
    const [chordState, setChordState] = useState<ParsedKey[]>([]);
    const chordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (contexts.isRecordingKeybinding) {
                return;
            }

            if (event.repeat && (event.metaKey || event.ctrlKey || event.altKey)) {
                return;
            }

            const target = event.target as HTMLElement | null;
            if (target) {
                const tag = target.tagName;
                const isEditable =
                    tag === "INPUT" ||
                    tag === "TEXTAREA" ||
                    target.isContentEditable;
                if (isEditable) {
                    return;
                }
            }

            const registryKeybindings = keymapRegistry.getAllKeybindings();
            const userOverrides = new Map(
                userKeybindings.map((kb) => [kb.command, kb])
            );

            const effective = registryKeybindings.map(
                (kb) => userOverrides.get(kb.command) ?? kb
            );

            for (const userKb of userKeybindings) {
                if (!effective.some((kb) => kb.command === userKb.command)) {
                    effective.push(userKb);
                }
            }

            const eventKey = eventToKey(event);

            for (const keybinding of effective) {
                if (keybinding.enabled === false) {
                    continue;
                }

                if (
                    keybinding.when &&
                    !evaluateWhenClause(keybinding.when, contexts)
                ) {
                    continue;
                }

                const result = matchKeybinding(
                    event,
                    keybinding.key,
                    chordState
                );

                if (result.matched) {
                    event.preventDefault();
                    event.stopPropagation();

                    setChordState([]);
                    if (chordTimeoutRef.current) {
                        clearTimeout(chordTimeoutRef.current);
                        chordTimeoutRef.current = null;
                    }

                    void keymapRegistry.executeCommand(
                        keybinding.command,
                        keybinding.args
                    );
                    return;
                }

                if (result.partialMatch) {
                    event.preventDefault();
                    event.stopPropagation();

                    const nextChord = [...chordState, eventKey];
                    setChordState(nextChord);

                    if (chordTimeoutRef.current) {
                        clearTimeout(chordTimeoutRef.current);
                    }

                    chordTimeoutRef.current = setTimeout(() => {
                        setChordState([]);
                        chordTimeoutRef.current = null;
                    }, CHORD_TIMEOUT_MS);

                    return;
                }
            }

            if (chordState.length > 0) {
                setChordState([]);
                if (chordTimeoutRef.current) {
                    clearTimeout(chordTimeoutRef.current);
                    chordTimeoutRef.current = null;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown, true);

        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
            if (chordTimeoutRef.current) {
                clearTimeout(chordTimeoutRef.current);
                chordTimeoutRef.current = null;
            }
        };
    }, [contexts, userKeybindings, chordState]);

    return {
        chordState,
        isAwaitingChord: chordState.length > 0
    };
}
