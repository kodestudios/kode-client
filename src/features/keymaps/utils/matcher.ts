import type { ParsedKey } from "./parser";
import { parseKeybinding } from "./parser";

/**
 * Map of `event.code` to logical key for non-letter keys. Lets shortcuts like
 * `cmd+=` keep working on layouts (e.g. Turkish QWERTY) where the character at
 * that physical position differs from the US layout.
 */
const CODE_TO_KEY: Record<string, string> = {
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/"
};

export function eventToKey(event: KeyboardEvent): ParsedKey {
    const modifiers: string[] = [];

    if (event.ctrlKey) modifiers.push("ctrl");
    if (event.metaKey) modifiers.push("cmd");
    if (event.altKey) modifiers.push("alt");
    if (event.shiftKey) modifiers.push("shift");

    modifiers.sort();

    let key = event.key;
    const hasModifier = event.metaKey || event.ctrlKey || event.altKey;
    if (
        key === "Dead" ||
        key === "Unidentified" ||
        (hasModifier && CODE_TO_KEY[event.code])
    ) {
        key = CODE_TO_KEY[event.code] || event.code;
    }

    return { modifiers, key };
}

export function keysMatch(a: ParsedKey, b: ParsedKey): boolean {
    if (a.key.toLowerCase() !== b.key.toLowerCase()) return false;
    if (a.modifiers.length !== b.modifiers.length) return false;

    for (let i = 0; i < a.modifiers.length; i++) {
        if (a.modifiers[i] !== b.modifiers[i]) return false;
    }

    return true;
}

export interface MatchResult {
    matched: boolean;
    partialMatch?: boolean;
    nextChordIndex?: number;
}

/**
 * Match a keyboard event against a keybinding string. Returns a partial-match
 * signal so the caller can buffer chord state.
 */
export function matchKeybinding(
    event: KeyboardEvent,
    keybinding: string,
    chordState?: ParsedKey[]
): MatchResult {
    const parsed = parseKeybinding(keybinding);
    const eventKey = eventToKey(event);

    if (!parsed.isChord) {
        if (chordState && chordState.length > 0) {
            return { matched: false };
        }
        return { matched: keysMatch(eventKey, parsed.parts[0]) };
    }

    const currentIndex = chordState ? chordState.length : 0;

    if (currentIndex >= parsed.parts.length) {
        return { matched: false };
    }

    const expectedKey = parsed.parts[currentIndex];
    const matches = keysMatch(eventKey, expectedKey);

    if (!matches) {
        return { matched: false };
    }

    if (currentIndex === parsed.parts.length - 1) {
        return { matched: true };
    }

    return {
        matched: false,
        partialMatch: true,
        nextChordIndex: currentIndex + 1
    };
}
