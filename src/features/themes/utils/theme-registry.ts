import kodeDarkRaw from "../themes/kode-dark.json";
import kodeLightRaw from "../themes/kode-light.json";
import type { Theme } from "../types";

const BUILT_IN_THEMES: Theme[] = [
    kodeDarkRaw as Theme,
    kodeLightRaw as Theme
];

const themesById = new Map<string, Theme>(
    BUILT_IN_THEMES.map((theme) => [theme.id, theme])
);

export const DEFAULT_THEME_ID = "kode-dark";

export function getThemes(): Theme[] {
    return [...BUILT_IN_THEMES];
}

export function getTheme(id: string): Theme | undefined {
    return themesById.get(id);
}

export function getThemeOrDefault(id: string | null | undefined): Theme {
    if (id) {
        const found = themesById.get(id);
        if (found) return found;
    }
    return themesById.get(DEFAULT_THEME_ID) ?? BUILT_IN_THEMES[0];
}
