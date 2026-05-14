import { openSettingsAction } from "@/features/settings";
import { toast } from "@/lib/toast";
import { checkForUpdates, downloadAndInstallPendingUpdate } from "../utils/updater";

const CHECK_TOAST_ID = "updater-manual-check";

/**
 * Manual "Check for Updates…" action. Opens the settings modal (so the user
 * sees the rich state in the General tab) and kicks off a check. Surfaces a
 * toast so the result is visible even if the modal is closed quickly.
 */
export async function checkForUpdatesAction(): Promise<void> {
    openSettingsAction();

    toast.loading({
        title: "Checking for updates…",
        id: CHECK_TOAST_ID,
        indestructible: true
    });

    try {
        const update = await checkForUpdates();
        if (update) {
            toast.info({
                title: `Update available · v${update.version}`,
                id: CHECK_TOAST_ID,
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
        } else {
            toast.success({
                title: "You're up to date",
                id: CHECK_TOAST_ID,
                duration: 3000
            });
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error({
            title: "Update check failed",
            id: CHECK_TOAST_ID,
            description: message,
            duration: 6000
        });
    }
}
