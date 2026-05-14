import { useEffect } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { keymapRegistry } from "../utils/registry";

const MENU_COMMAND_EVENT = "menu:command";

/**
 * Listen for menu-driven command dispatches coming from the native (Tauri)
 * menu bar and route them through the same registry the hotkey system uses,
 * so menus and shortcuts stay in lockstep.
 */
export function useMenuEvents(): void {
    useEffect(() => {
        let unlisten: UnlistenFn | undefined;
        let cancelled = false;

        void listen<string>(MENU_COMMAND_EVENT, (event) => {
            const commandId = event.payload;
            if (typeof commandId === "string" && commandId.length > 0) {
                void keymapRegistry.executeCommand(commandId);
            }
        }).then((fn) => {
            if (cancelled) {
                fn();
                return;
            }
            unlisten = fn;
        });

        return () => {
            cancelled = true;
            unlisten?.();
        };
    }, []);
}
