import { useEffect } from "react";
import { toast } from "@/lib/toast";
import {
    checkForUpdates,
    downloadAndInstallPendingUpdate,
    loadCurrentVersion
} from "../utils/updater";

const TOAST_ID = "updater-available";

/**
 * Runs a single update check on mount and, if a new version is available,
 * surfaces a persistent toast with `Not now` / `Update` actions.
 *
 * Skips the network round-trip in dev (the bundled updater pubkey is a
 * placeholder, so the check would fail) — the manual button in Settings
 * still works everywhere.
 */
export function useAutoUpdateCheck(): void {
    useEffect(() => {
        let cancelled = false;

        void (async () => {
            await loadCurrentVersion();

            if (import.meta.env.DEV) return;

            const update = await checkForUpdates({ silent: true });
            if (cancelled || !update) return;

            toast.info({
                title: `Update available · v${update.version}`,
                id: TOAST_ID,
                description: "A new version of Kode is ready to install.",
                actions: [
                    {
                        label: "Update",
                        onClick: () => {
                            void downloadAndInstallPendingUpdate().catch((err) => {
                                const message =
                                    err instanceof Error ? err.message : String(err);
                                toast.error({
                                    title: "Update failed",
                                    description: message
                                });
                            });
                        }
                    },
                    {
                        label: "Not now",
                        onClick: ({ dismiss }) => {
                            dismiss();
                        },
                        variant: "secondary"
                    }
                ]
            });
        })();

        return () => {
            cancelled = true;
        };
    }, []);
}

export function getAutoUpdateToastId(): string {
    return TOAST_ID;
}
