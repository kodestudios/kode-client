import { useEffect } from "react";
import { useWorkspaceStore } from "@/features/workspace/stores/workspace-store";
import { useKeymapStore } from "../stores/keymap-store";

/**
 * Bridges domain state (workspace, etc.) into the keymap context so `when`
 * clauses on keybindings can react to it.
 */
export function useKeymapContextSync(): void {
    const workspacePath = useWorkspaceStore((state) => state.path);
    const setContext = useKeymapStore((state) => state.actions.setContext);

    useEffect(() => {
        setContext("workspaceHasFolder", Boolean(workspacePath));
    }, [workspacePath, setContext]);
}
