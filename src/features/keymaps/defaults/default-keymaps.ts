import type { Keybinding } from "../types";

/**
 * Built-in keybindings. `cmd` is auto-normalized to `ctrl` on Windows/Linux
 * by the parser.
 */
export const defaultKeymaps: Keybinding[] = [
    {
        key: "cmd+o",
        command: "workspace.openFolder",
        source: "default"
    },
    {
        key: "cmd+k f",
        command: "workspace.closeFolder",
        when: "workspaceHasFolder",
        source: "default"
    }
];
