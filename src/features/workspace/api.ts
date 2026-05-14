import { invoke } from "@tauri-apps/api/core";

export interface FileTreeEntry {
    name: string;
    path: string;
    isDirectory: boolean;
}

export async function openFolder(): Promise<string | null> {
    const result = await invoke<string | null>("open_folder");
    return result ?? null;
}

export async function readDirectory(path: string): Promise<FileTreeEntry[]> {
    return await invoke<FileTreeEntry[]>("read_directory", { path });
}
