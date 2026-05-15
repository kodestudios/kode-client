import { useEffect, useMemo } from "react";
import {
    ArrowsClockwiseIcon,
    CheckCircleIcon,
    DownloadSimpleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { SettingsItem } from "@/features/settings/components/settings-item";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import { useUpdaterStore, type UpdateStatus } from "../stores";
import {
    checkForUpdates,
    downloadAndInstallPendingUpdate,
    loadCurrentVersion
} from "../utils/updater";

const formatBytes = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const exponent = Math.min(
        units.length - 1,
        Math.floor(Math.log(bytes) / Math.log(1024))
    );
    const value = bytes / Math.pow(1024, exponent);
    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

interface StatusPresentation {
    icon: React.ReactNode;
    iconClassName: string;
    statusLine: string;
}

function getStatusPresentation(
    status: UpdateStatus,
    availableVersion: string | null,
    error: string | null
): StatusPresentation {
    switch (status) {
        case "checking":
            return {
                icon: (
                    <ArrowsClockwiseIcon
                        className="size-3.5 animate-spin"
                        weight="bold"
                    />
                ),
                iconClassName: "text-fg-subtle",
                statusLine: "Checking for updates…"
            };
        case "available":
            return {
                icon: <DownloadSimpleIcon className="size-3.5" weight="bold" />,
                iconClassName: "text-accent",
                statusLine: availableVersion
                    ? `Update available — v${availableVersion}`
                    : "Update available"
            };
        case "downloading":
            return {
                icon: (
                    <ArrowsClockwiseIcon
                        className="size-3.5 animate-spin"
                        weight="bold"
                    />
                ),
                iconClassName: "text-accent",
                statusLine: "Downloading update…"
            };
        case "installing":
        case "ready":
            return {
                icon: (
                    <ArrowsClockwiseIcon
                        className="size-3.5 animate-spin"
                        weight="bold"
                    />
                ),
                iconClassName: "text-accent",
                statusLine: "Installing — Kode will restart shortly."
            };
        case "up-to-date":
            return {
                icon: <CheckCircleIcon className="size-3.5" weight="fill" />,
                iconClassName: "text-emerald-400",
                statusLine: "You're up to date"
            };
        case "error":
            return {
                icon: <WarningCircleIcon className="size-3.5" weight="fill" />,
                iconClassName: "text-red-400",
                statusLine: error
                    ? `Update check failed — ${error}`
                    : "Update check failed"
            };
        case "idle":
        default:
            return {
                icon: null,
                iconClassName: "",
                statusLine: "Check for the latest version of Kode."
            };
    }
}

export function UpdateSettingsCard() {
    const status = useUpdaterStore((s) => s.status);
    const currentVersion = useUpdaterStore((s) => s.currentVersion);
    const availableVersion = useUpdaterStore((s) => s.availableVersion);
    const progress = useUpdaterStore((s) => s.progress);
    const releaseNotes = useUpdaterStore((s) => s.releaseNotes);
    const error = useUpdaterStore((s) => s.error);

    useEffect(() => {
        void loadCurrentVersion();
    }, []);

    const presentation = useMemo(
        () =>
            getStatusPresentation(
                status,
                availableVersion,
                error
            ),
        [status, availableVersion, error]
    );

    const isBusy =
        status === "checking" ||
        status === "downloading" ||
        status === "installing" ||
        status === "ready";

    const progressPercent = useMemo(() => {
        if (!progress || !progress.total) return null;
        return Math.min(
            100,
            Math.max(0, (progress.downloaded / progress.total) * 100)
        );
    }, [progress]);

    const handlePrimary = () => {
        if (status === "available") {
            void downloadAndInstallPendingUpdate().catch(() => {
                // Error is already surfaced in the store.
            });
            return;
        }

        void checkForUpdates({ silent: true }).then((update) => {
            if (!update && useUpdaterStore.getState().status === "up-to-date") {
                toast.success({
                    title: "You're up to date",
                    id: "updater-manual-check",
                    duration: 3000
                });
            }
        });
    };

    const primaryLabel =
        status === "available"
            ? "Install update"
            : status === "checking"
              ? "Checking…"
              : status === "downloading"
                ? "Downloading…"
                : status === "installing" || status === "ready"
                  ? "Installing…"
                  : "Check for updates";

    const primaryIcon =
        status === "available" ? (
            <DownloadSimpleIcon className="size-3.5" weight="bold" />
        ) : (
            <ArrowsClockwiseIcon
                className={cn(
                    "size-3.5",
                    status === "checking" && "animate-spin"
                )}
                weight="bold"
            />
        );

    return (
        <SettingsItem
            title="Software updates"
            description={
                <>
                    <div>
                        {currentVersion ? (
                            <>
                                Kode v{currentVersion}
                                {availableVersion &&
                                    availableVersion !== currentVersion && (
                                        <span className="text-fg-muted">
                                            {" "}
                                            → v{availableVersion}
                                        </span>
                                    )}
                            </>
                        ) : (
                            "Kode"
                        )}
                    </div>
                    <div
                        className={cn(
                            "mt-1.5 flex items-center gap-1.5 text-xs leading-5",
                            presentation.iconClassName || "text-fg-subtle"
                        )}
                    >
                        {presentation.icon}
                        <span className="truncate">
                            {presentation.statusLine}
                        </span>
                    </div>

                    {(status === "downloading" ||
                        status === "installing" ||
                        status === "ready") && (
                        <div className="mt-2.5">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-panel">
                                <div
                                    className="h-full bg-accent transition-[width] duration-200 ease-out"
                                    style={{
                                        width:
                                            progressPercent === null
                                                ? "100%"
                                                : `${progressPercent}%`
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-fg-subtle">
                                <span>
                                    {progress
                                        ? `${formatBytes(progress.downloaded)}${
                                              progress.total
                                                  ? ` / ${formatBytes(progress.total)}`
                                                  : ""
                                          }`
                                        : "Preparing…"}
                                </span>
                                <span>
                                    {progressPercent !== null
                                        ? `${progressPercent.toFixed(0)}%`
                                        : ""}
                                </span>
                            </div>
                        </div>
                    )}

                    {status === "available" && releaseNotes && (
                        <details className="mt-2 text-xs text-fg-muted">
                            <summary className="cursor-pointer select-none text-fg-subtle hover:text-fg">
                                Release notes
                            </summary>
                            <pre className="mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap rounded-xs bg-overlay/60 p-2 font-sans text-[11px] leading-5 text-fg-muted">
                                {releaseNotes}
                            </pre>
                        </details>
                    )}
                </>
            }
        >
            <Button
                size="sm"
                variant={status === "available" ? "primary" : "secondary"}
                onClick={handlePrimary}
                disabled={isBusy}
                loading={status === "checking"}
                leftIcon={status === "checking" ? undefined : primaryIcon}
            >
                {primaryLabel}
            </Button>
        </SettingsItem>
    );
}
