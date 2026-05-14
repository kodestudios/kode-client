import { create } from "zustand";

export type UpdateStatus =
    | "idle"
    | "checking"
    | "up-to-date"
    | "available"
    | "downloading"
    | "installing"
    | "ready"
    | "error";

export interface UpdaterProgress {
    downloaded: number;
    total: number | null;
}

interface UpdaterState {
    status: UpdateStatus;
    currentVersion: string | null;
    availableVersion: string | null;
    releaseNotes: string | null;
    releaseDate: string | null;
    progress: UpdaterProgress | null;
    error: string | null;
    lastCheckedAt: number | null;
}

export const useUpdaterStore = create<UpdaterState>()(() => ({
    status: "idle",
    currentVersion: null,
    availableVersion: null,
    releaseNotes: null,
    releaseDate: null,
    progress: null,
    error: null,
    lastCheckedAt: null
}));
