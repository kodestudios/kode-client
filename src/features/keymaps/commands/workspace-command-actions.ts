import { openFolder } from "@/features/workspace/api";
import { useWorkspaceStore } from "@/features/workspace/stores/workspace-store";

export async function openWorkspaceFolderAction(): Promise<void> {
    const picked = await openFolder();
    if (picked) {
        useWorkspaceStore.getState().setWorkspace(picked);
    }
}

export function closeWorkspaceFolderAction(): void {
    useWorkspaceStore.getState().closeWorkspace();
}
