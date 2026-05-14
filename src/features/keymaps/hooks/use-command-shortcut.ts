import { useKeymapStore } from "../stores/keymap-store";
import { keymapRegistry } from "../utils/registry";

/**
 * Reactive lookup for the active keybinding string of a command.
 * Prefers a user override; falls back to the registry default.
 */
export function useCommandShortcut(commandId?: string): string | undefined {
    const userKeybindings = useKeymapStore((state) => state.keybindings);

    if (!commandId) return undefined;

    const userOverride = userKeybindings.find(
        (kb) => kb.command === commandId
    );
    if (userOverride) {
        return userOverride.key;
    }

    return keymapRegistry.getKeybinding(commandId)?.key;
}
