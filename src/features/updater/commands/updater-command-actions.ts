import { toast } from "sonner";
import { openSettingsAction } from "@/features/settings";
import { checkForUpdates, downloadAndInstallPendingUpdate } from "../utils/updater";

const CHECK_TOAST_ID = "updater-manual-check";

/**
 * Manual "Check for Updates…" action. Opens the settings modal (so the user
 * sees the rich state in the General tab) and kicks off a check. Surfaces a
 * sonner toast so the result is visible even if the modal is closed quickly.
 */
export async function checkForUpdatesAction(): Promise<void> {
    openSettingsAction();

    toast.loading("Checking for updates…", {
        id: CHECK_TOAST_ID,
        duration: Infinity
    });

    try {
        const update = await checkForUpdates();
        if (update) {
            toast.message(`Update available · v${update.version}`, {
                id: CHECK_TOAST_ID,
                description: "A new version of Kode is ready to install.",
                duration: Infinity,
                action: {
                    label: "Update",
                    onClick: () => {
                        toast.dismiss(CHECK_TOAST_ID);
                        void downloadAndInstallPendingUpdate().catch((err) => {
                            const message =
                                err instanceof Error ? err.message : String(err);
                            toast.error("Update failed", {
                                description: message
                            });
                        });
                    }
                },
                cancel: {
                    label: "Not now",
                    onClick: () => {
                        toast.dismiss(CHECK_TOAST_ID);
                    }
                }
            });
        } else {
            toast.success("You're up to date", {
                id: CHECK_TOAST_ID,
                duration: 3000
            });
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error("Update check failed", {
            id: CHECK_TOAST_ID,
            description: message,
            duration: 6000
        });
    }
}
