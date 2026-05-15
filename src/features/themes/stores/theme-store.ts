import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { applyTheme, DEFAULT_THEME_ID, getThemeOrDefault } from "../utils";

interface ThemeState {
    themeId: string;
    setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            themeId: DEFAULT_THEME_ID,
            setTheme: (id) => {
                const theme = getThemeOrDefault(id);
                applyTheme(theme);
                set({ themeId: theme.id });
            }
        }),
        {
            name: "kode.theme",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                const theme = getThemeOrDefault(state.themeId);
                applyTheme(theme);
                if (theme.id !== state.themeId) {
                    state.themeId = theme.id;
                }
            }
        }
    )
);

/**
 * Read the persisted theme id directly from `localStorage` (no React, no
 * Zustand rehydration). This is used by `initializeTheme()` to apply the
 * correct CSS variables synchronously before the first paint and avoid a
 * theme flash on app start.
 */
export function readPersistedThemeId(): string | null {
    if (typeof localStorage === "undefined") return null;
    try {
        const raw = localStorage.getItem("kode.theme");
        if (!raw) return null;
        const parsed = JSON.parse(raw) as {
            state?: { themeId?: unknown };
        };
        const id = parsed?.state?.themeId;
        return typeof id === "string" ? id : null;
    } catch {
        return null;
    }
}

/**
 * Apply the persisted (or default) theme before React mounts. Call once from
 * `main.tsx` so the very first render already uses the correct palette.
 */
export function initializeTheme(): void {
    const theme = getThemeOrDefault(readPersistedThemeId());
    applyTheme(theme);
}
