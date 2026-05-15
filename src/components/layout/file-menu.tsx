import type { ReactNode } from "react";
import { Menu } from "@/components/ui/Menu";
import {
    formatShortcut,
    keymapRegistry,
    useCommandShortcut
} from "@/features/keymaps";
import { useWorkspaceStore } from "@/features/workspace";

export function FileMenu() {
    const hasWorkspace = useWorkspaceStore((state) => Boolean(state.path));
    const openShortcut = useCommandShortcut("workspace.openFolder");
    const closeShortcut = useCommandShortcut("workspace.closeFolder");

    const runCommand = (commandId: string) => {
        void keymapRegistry.executeCommand(commandId);
    };

    return (
        <Menu>
            <Menu.Trigger
                className="cursor-pointer rounded-xs px-2 py-0.5 text-xs text-fg-muted outline-none transition-colors hover:bg-panel hover:text-fg data-[popup-open]:bg-panel data-[popup-open]:text-fg"
                onMouseDown={(event) => event.stopPropagation()}
                onDoubleClick={(event) => event.stopPropagation()}
            >
                File
            </Menu.Trigger>
            <Menu.Content align="start" sideOffset={4}>
                <FileMenuItem
                    label="Open Folder…"
                    shortcut={openShortcut}
                    onSelect={() => runCommand("workspace.openFolder")}
                />
                <Menu.Separator />
                <FileMenuItem
                    label="Close Folder"
                    shortcut={closeShortcut}
                    disabled={!hasWorkspace}
                    onSelect={() => runCommand("workspace.closeFolder")}
                />
            </Menu.Content>
        </Menu>
    );
}

interface FileMenuItemProps {
    label: ReactNode;
    shortcut?: string;
    disabled?: boolean;
    onSelect: () => void;
}

function FileMenuItem({
    label,
    shortcut,
    disabled,
    onSelect
}: FileMenuItemProps) {
    return (
        <Menu.Item
            disabled={disabled}
            onClick={onSelect}
            className="min-w-[12rem] gap-6"
        >
            <span>{label}</span>
            {shortcut && (
                <span className="ml-auto font-mono text-[10px] text-fg-faint">
                    {formatShortcut(shortcut)}
                </span>
            )}
        </Menu.Item>
    );
}
