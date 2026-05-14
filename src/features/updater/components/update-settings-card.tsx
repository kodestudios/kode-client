import { useEffect, useMemo } from "react";
import {
    ArrowsClockwiseIcon,
    CheckCircleIcon,
    DownloadSimpleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useUpdaterStore, type UpdateStatus } from "../stores";
import {
    checkForUpdates,
    downloadAndInstallPendingUpdate,
    loadCurrentVersion
} from "../utils/updater";

dayjs.extend(relativeTime);

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
    error: string | null,
    lastCheckedAt: number | null
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
                iconClassName: "text-dark-200",
                statusLine: "Checking for updates…"
            };
        case "available":
            return {
                icon: <DownloadSimpleIcon className="size-3.5" weight="bold" />,
                iconClassName: "text-primary-100",
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
                iconClassName: "text-primary-100",
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
                iconClassName: "text-primary-100",
                statusLine: "Installing — Kode will restart shortly."
            };
        case "up-to-date":
            return {
                icon: <CheckCircleIcon className="size-3.5" weight="fill" />,
                iconClassName: "text-emerald-400",
                statusLine: lastCheckedAt
                    ? `You're up to date · checked ${dayjs(lastCheckedAt).fromNow()}`
                    : "You're up to date"
            };
        case "error":
            return {
                icon: <WarningCircleIcon className="size-3.5" weight="fill" />,
                iconClassName: "text-red-400",
                statusLine: error ? `Update check failed — ${error}` : "Update check failed"
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
    const lastCheckedAt = useUpdaterStore((s) => s.lastCheckedAt);
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
                error,
                lastCheckedAt
            ),
        [status, availableVersion, error, lastCheckedAt]
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
        void checkForUpdates({ silent: true });
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
        <div className="rounded-sm border border-dark-700 bg-dark-800/40 px-3 py-2.5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-dark-50">
                        Software updates
                    </div>
                    <div className="mt-1 text-xs leading-5 text-dark-200">
                        {currentVersion ? (
                            <>
                                Kode v{currentVersion}
                                {availableVersion &&
                                    availableVersion !== currentVersion && (
                                        <span className="text-dark-100">
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
                            presentation.iconClassName ||
                                "text-dark-200"
                        )}
                    >
                        {presentation.icon}
                        <span className="truncate">{presentation.statusLine}</span>
                    </div>
                </div>
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
            </div>

            {(status === "downloading" ||
                status === "installing" ||
                status === "ready") && (
                <div className="mt-2.5">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-dark-700">
                        <div
                            className="h-full bg-primary-100 transition-[width] duration-200 ease-out"
                            style={{
                                width:
                                    progressPercent === null
                                        ? "100%"
                                        : `${progressPercent}%`
                            }}
                        />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-dark-200">
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
                <details className="mt-2 text-xs text-dark-100">
                    <summary className="cursor-pointer select-none text-dark-200 hover:text-dark-50">
                        Release notes
                    </summary>
                    <pre className="mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap rounded-xs bg-dark-900/60 p-2 font-sans text-[11px] leading-5 text-dark-100">
                        {releaseNotes}
                    </pre>
                </details>
            )}
        </div>
    );
}
