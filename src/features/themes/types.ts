export type ThemeAppearance = "light" | "dark";

export const THEME_COLOR_TOKENS = [
    "canvas",
    "panel",
    "muted",
    "strong",
    "emphasis",
    "elevated",
    "overlay",
    "sunken",
    "fg",
    "fg-muted",
    "fg-subtle",
    "fg-faint",
    "fg-disabled",
    "on-accent",
    "line",
    "line-strong",
    "line-focus",
    "accent",
    "accent-hover",
    "accent-active",
    "accent-subtle",
    "accent-strong"
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_TOKENS)[number];

export type ThemeColors = Record<ThemeColorToken, string>;

export interface Theme {
    id: string;
    name: string;
    description?: string;
    appearance: ThemeAppearance;
    colors: ThemeColors;
}
