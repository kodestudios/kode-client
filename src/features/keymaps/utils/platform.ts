type Platform = "macos" | "windows" | "linux" | "unknown";

function detectPlatform(): Platform {
    if (typeof navigator === "undefined") {
        return "unknown";
    }

    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    if (platform.includes("mac") || userAgent.includes("mac os")) {
        return "macos";
    }

    if (platform.includes("win") || userAgent.includes("windows")) {
        return "windows";
    }

    if (platform.includes("linux") || userAgent.includes("linux")) {
        return "linux";
    }

    return "unknown";
}

export const CURRENT_PLATFORM: Platform = detectPlatform();

export const IS_MAC: boolean = CURRENT_PLATFORM === "macos";
export const IS_WINDOWS: boolean = CURRENT_PLATFORM === "windows";
export const IS_LINUX: boolean = CURRENT_PLATFORM === "linux";

/**
 * Normalize key combination for current platform.
 * Converts 'cmd' to 'ctrl' on Windows/Linux.
 */
export function normalizeKey(key: string): string {
    if (IS_MAC) return key;
    return key.replace(/\bcmd\b/gi, "ctrl");
}

/**
 * Platform-specific primary modifier key name.
 * Returns 'cmd' on Mac, 'ctrl' on Windows/Linux/Unknown.
 */
export function getModifierKey(): "cmd" | "ctrl" {
    return IS_MAC ? "cmd" : "ctrl";
}
