import type { Command } from "../types";
import { keymapRegistry } from "../utils/registry";
import {
    closeWorkspaceFolderAction,
    openWorkspaceFolderAction
} from "./workspace-command-actions";

const workspaceCommands: Command[] = [
    {
        id: "workspace.openFolder",
        title: "Open Folder",
        category: "Workspace",
        keybinding: "cmd+o",
        execute: openWorkspaceFolderAction
    },
    {
        id: "workspace.closeFolder",
        title: "Close Folder",
        category: "Workspace",
        keybinding: "cmd+k f",
        execute: closeWorkspaceFolderAction
    }
];

const allCommands: Command[] = [...workspaceCommands];

export function registerCommands(): void {
    for (const command of allCommands) {
        keymapRegistry.registerCommand(command);
    }
}
