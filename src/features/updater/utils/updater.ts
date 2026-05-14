import { getVersion } from "@tauri-apps/api/app";
import { relaunch } from "@tauri-apps/plugin-process";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { useUpdaterStore } from "../stores";

/**
 * The most recent `Update` handle returned from `check()`. We keep it around so
 * the "Update" action in the toast / settings can install without re-checking.
 * Holding it also lets us close the underlying Rust resource if we drop it.
 */
let pendingUpdate: Update | null = null;

async function setPendingUpdate(next: Update | null): Promise<void> {
    if (pendingUpdate && pendingUpdate !== next) {
        try {
            await pendingUpdate.close();
        } catch {
            // Resource may already be dropped on the Rust side.
        }
    }
    pendingUpdate = next;
}

export function getPendingUpdate(): Update | null {
    return pendingUpdate;
}

export async function loadCurrentVersion(): Promise<string> {
    const cached = useUpdaterStore.getState().currentVersion;
    if (cached) return cached;
    const version = await getVersion();
    useUpdaterStore.setState({ currentVersion: version });
    return version;
}

export interface CheckOptions {
    /** When true, swallow errors and surface them only via store state. */
    silent?: boolean;
}

export async function checkForUpdates(
    opts: CheckOptions = {}
): Promise<Update | null> {
    const { status } = useUpdaterStore.getState();
    if (
        status === "checking" ||
        status === "downloading" ||
        status === "installing"
    ) {
        return pendingUpdate;
    }

    useUpdaterStore.setState({ status: "checking", error: null });

    try {
        await loadCurrentVersion();
        const update = await check();
        useUpdaterStore.setState({ lastCheckedAt: Date.now() });

        if (update) {
            await setPendingUpdate(update);
            useUpdaterStore.setState({
                status: "available",
                availableVersion: update.version,
                releaseNotes: update.body ?? null,
                releaseDate: update.date ?? null
            });
            return update;
        }

        await setPendingUpdate(null);
        useUpdaterStore.setState({
            status: "up-to-date",
            availableVersion: null,
            releaseNotes: null,
            releaseDate: null
        });
        return null;
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        useUpdaterStore.setState({ status: "error", error: message });
        if (!opts.silent) throw err;
        return null;
    }
}

export async function downloadAndInstallPendingUpdate(): Promise<void> {
    let update = pendingUpdate;
    if (!update) {
        update = await checkForUpdates({ silent: true });
    }
    if (!update) {
        useUpdaterStore.setState({
            status: "error",
            error: "No update is available."
        });
        return;
    }

    useUpdaterStore.setState({
        status: "downloading",
        progress: { downloaded: 0, total: null },
        error: null
    });

    let downloaded = 0;
    let total: number | null = null;

    try {
        await update.downloadAndInstall((event) => {
            switch (event.event) {
                case "Started":
                    total = event.data.contentLength ?? null;
                    useUpdaterStore.setState({
                        progress: { downloaded: 0, total }
                    });
                    break;
                case "Progress":
                    downloaded += event.data.chunkLength;
                    useUpdaterStore.setState({
                        progress: { downloaded, total }
                    });
                    break;
                case "Finished":
                    useUpdaterStore.setState({ status: "installing" });
                    break;
            }
        });
        useUpdaterStore.setState({ status: "ready" });
        // On Windows the installer typically exits the app for us. On macOS /
        // Linux we restart explicitly so the user lands on the new build.
        await relaunch();
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        useUpdaterStore.setState({ status: "error", error: message });
        throw err;
    }
}
