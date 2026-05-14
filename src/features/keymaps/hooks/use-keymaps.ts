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
 *
 * The listener is intentionally installed only on mount and read fresh
 * state through refs. If we re-bound it whenever `contexts`,
 * `userKeybindings`, or `chordState` changed, the effect cleanup would
 * wipe the pending chord-reset timeout before it ever fires, so chord
 * buffers would never auto-clear after `CHORD_TIMEOUT_MS`.
 */
export function useKeymaps() {
    const contexts = useKeymapStore((state) => state.contexts);
    const userKeybindings = useKeymapStore((state) => state.keybindings);
    const [chordState, setChordState] = useState<ParsedKey[]>([]);

    const contextsRef = useRef(contexts);
    const userKeybindingsRef = useRef(userKeybindings);
    const chordStateRef = useRef<ParsedKey[]>(chordState);
    const chordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    contextsRef.current = contexts;
    userKeybindingsRef.current = userKeybindings;
    chordStateRef.current = chordState;

    useEffect(() => {
        const updateChordState = (next: ParsedKey[]) => {
            chordStateRef.current = next;
            setChordState(next);
        };

        const clearChordTimeout = () => {
            if (chordTimeoutRef.current) {
                clearTimeout(chordTimeoutRef.current);
                chordTimeoutRef.current = null;
            }
        };

        const resetChord = () => {
            clearChordTimeout();
            if (chordStateRef.current.length > 0) {
                updateChordState([]);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const currentContexts = contextsRef.current;
            const currentUserKeybindings = userKeybindingsRef.current;
            const currentChordState = chordStateRef.current;

            if (currentContexts.isRecordingKeybinding) {
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
                currentUserKeybindings.map((kb) => [kb.command, kb])
            );

            const effective = registryKeybindings.map(
                (kb) => userOverrides.get(kb.command) ?? kb
            );

            for (const userKb of currentUserKeybindings) {
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
                    !evaluateWhenClause(keybinding.when, currentContexts)
                ) {
                    continue;
                }

                const result = matchKeybinding(
                    event,
                    keybinding.key,
                    currentChordState
                );

                if (result.matched) {
                    event.preventDefault();
                    event.stopPropagation();

                    clearChordTimeout();
                    updateChordState([]);

                    void keymapRegistry.executeCommand(
                        keybinding.command,
                        keybinding.args
                    );
                    return;
                }

                if (result.partialMatch) {
                    event.preventDefault();
                    event.stopPropagation();

                    const nextChord = [...currentChordState, eventKey];
                    updateChordState(nextChord);

                    clearChordTimeout();
                    chordTimeoutRef.current = setTimeout(() => {
                        chordTimeoutRef.current = null;
                        chordStateRef.current = [];
                        setChordState([]);
                    }, CHORD_TIMEOUT_MS);

                    return;
                }
            }

            if (currentChordState.length > 0) {
                resetChord();
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
    }, []);

    return {
        chordState,
        isAwaitingChord: chordState.length > 0
    };
}
