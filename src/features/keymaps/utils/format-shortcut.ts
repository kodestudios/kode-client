import { parseKeybinding, type ParsedKey } from "./parser";
import { IS_MAC } from "./platform";

const MAC_MODIFIER_SYMBOLS: Record<string, string> = {
    cmd: "⌘",
    ctrl: "⌃",
    alt: "⌥",
    shift: "⇧",
    meta: "⌘"
};

const KEY_LABELS: Record<string, string> = {
    Enter: "↵",
    Tab: "⇥",
    " ": "Space",
    Backspace: "⌫",
    Delete: "⌦",
    Escape: "Esc",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    PageUp: "PgUp",
    PageDown: "PgDn"
};

function formatKey(part: ParsedKey, joiner: string): string {
    const modifierLabels = part.modifiers.map((mod) => {
        if (IS_MAC) {
            return MAC_MODIFIER_SYMBOLS[mod] ?? mod;
        }
        return mod.charAt(0).toUpperCase() + mod.slice(1);
    });

    const keyLabel =
        KEY_LABELS[part.key] ??
        (part.key.length === 1
            ? part.key.toUpperCase()
            : part.key.charAt(0).toUpperCase() + part.key.slice(1));

    const segments = [...modifierLabels, keyLabel];

    if (IS_MAC) {
        return segments.join("");
    }

    return segments.join(joiner);
}

/**
 * Format a keybinding string (e.g. `"cmd+o"`) for display. On macOS this
 * produces a glyph string (`⌘O`); elsewhere a plain `Ctrl+O`.
 */
export function formatShortcut(binding: string | undefined): string {
    if (!binding) return "";

    const parsed = parseKeybinding(binding);
    const joiner = IS_MAC ? "" : "+";
    const chordSeparator = " ";

    return parsed.parts
        .map((part) => formatKey(part, joiner))
        .join(chordSeparator);
}
