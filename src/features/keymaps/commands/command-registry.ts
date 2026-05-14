import type { Command } from "../types";
import { keymapRegistry } from "../utils/registry";
import { openSettingsAction } from "@/features/settings";
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

const settingsCommands: Command[] = [
    {
        id: "settings.open",
        title: "Open Settings",
        category: "Settings",
        keybinding: "cmd+,",
        execute: openSettingsAction
    }
];

const allCommands: Command[] = [...workspaceCommands, ...settingsCommands];

export function registerCommands(): void {
    for (const command of allCommands) {
        keymapRegistry.registerCommand(command);
    }
}
