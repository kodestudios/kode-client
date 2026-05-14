import { normalizeKey } from "./platform";

export interface ParsedKey {
    modifiers: string[];
    key: string;
}

export interface ParsedKeybinding {
    parts: ParsedKey[];
    isChord: boolean;
}

const MODIFIER_KEYS = ["ctrl", "cmd", "alt", "shift", "meta"];

/**
 * Canonical modifier names. `eventToKey` always emits `cmd` for
 * `event.metaKey`, so a user-written `meta+*` binding would otherwise
 * never match the runtime event.
 */
const MODIFIER_ALIASES: Record<string, string> = {
    meta: "cmd",
    option: "alt",
    control: "ctrl",
    command: "cmd"
};

const SPECIAL_KEYS: Record<string, string> = {
    enter: "Enter",
    return: "Enter",
    tab: "Tab",
    space: " ",
    backspace: "Backspace",
    delete: "Delete",
    escape: "Escape",
    esc: "Escape",
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    pageup: "PageUp",
    pagedown: "PageDown",
    home: "Home",
    end: "End",
    insert: "Insert"
};

/**
 * Parse a key combination string like "cmd+s" or "ctrl+shift+p".
 */
export function parseKeyCombination(combo: string): ParsedKey {
    const parts = combo
        .toLowerCase()
        .split("+")
        .map((p) => p.trim());

    const modifiers: string[] = [];
    let key = "";

    for (const part of parts) {
        const canonical = MODIFIER_ALIASES[part] ?? part;
        if (MODIFIER_KEYS.includes(canonical)) {
            if (!modifiers.includes(canonical)) {
                modifiers.push(canonical);
            }
        } else {
            key = part;
        }
    }

    if (SPECIAL_KEYS[key]) {
        key = SPECIAL_KEYS[key];
    }

    modifiers.sort();

    return { modifiers, key };
}

/**
 * Parse a full keybinding string. Space-separated combinations form a chord,
 * e.g. "cmd+k cmd+t".
 */
export function parseKeybinding(binding: string): ParsedKeybinding {
    const normalized = normalizeKey(binding);

    const parts = normalized
        .split(/\s+/)
        .filter((p) => p.length > 0)
        .map(parseKeyCombination);

    return {
        parts,
        isChord: parts.length > 1
    };
}

export function stringifyKeyCombination(parsed: ParsedKey): string {
    const parts = [...parsed.modifiers];
    if (parsed.key) {
        parts.push(parsed.key);
    }
    return parts.join("+");
}

export function stringifyKeybinding(parsed: ParsedKeybinding): string {
    return parsed.parts.map(stringifyKeyCombination).join(" ");
}
