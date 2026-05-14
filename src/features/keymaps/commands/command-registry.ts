import type { Command } from "../types";
import { keymapRegistry } from "../utils/registry";
import { openSettingsAction } from "@/features/settings";
import { checkForUpdatesAction } from "@/features/updater";
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

const updaterCommands: Command[] = [
    {
        id: "app.checkForUpdates",
        title: "Check for Updates…",
        category: "Application",
        execute: () => {
            void checkForUpdatesAction();
        }
    }
];

const allCommands: Command[] = [
    ...workspaceCommands,
    ...settingsCommands,
    ...updaterCommands
];

export function registerCommands(): void {
    for (const command of allCommands) {
        keymapRegistry.registerCommand(command);
    }
}
