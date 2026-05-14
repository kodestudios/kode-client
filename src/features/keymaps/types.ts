import type { ReactNode } from "react";

export type KeybindingSource = "user" | "extension" | "default" | "preset";

export interface Keybinding {
    key: string;
    command: string;
    when?: string;
    args?: unknown;
    source: KeybindingSource;
    enabled?: boolean;
}

export interface Command {
    id: string;
    title: string;
    category?: string;
    keybinding?: string;
    description?: string;
    icon?: ReactNode;
    execute: (args?: unknown) => void | Promise<void>;
}

export interface KeymapContext {
    editorFocus: boolean;
    terminalFocus: boolean;
    sidebarFocus: boolean;
    hasSelection: boolean;
    isRecordingKeybinding: boolean;
    workspaceHasFolder: boolean;
    [key: string]: boolean;
}

export interface KeymapStore {
    keybindings: Keybinding[];
    contexts: Partial<KeymapContext>;
}
