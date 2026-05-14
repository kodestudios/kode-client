import { registerCommands } from "./commands/command-registry";
import { registerDefaultKeymaps } from "./defaults/register-defaults";

let initialized = false;

/**
 * Register every built-in command and its default keybinding.
 * Idempotent — safe to call multiple times.
 */
export function initializeKeymaps(): void {
    if (initialized) return;
    initialized = true;

    registerCommands();
    registerDefaultKeymaps();
}
