import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
    path: string | null;
    setWorkspace: (path: string | null) => void;
    closeWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    persist(
        (set) => ({
            path: null,
            setWorkspace: (path) => set({ path }),
            closeWorkspace: () => set({ path: null })
        }),
        { name: "kode:workspace" }
    )
);

export function workspaceName(path: string | null): string | null {
    if (!path) return null;
    const segments = path.split(/[\\/]/).filter(Boolean);
    return segments[segments.length - 1] ?? path;
}
