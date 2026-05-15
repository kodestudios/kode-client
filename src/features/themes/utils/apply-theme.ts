import { THEME_COLOR_TOKENS, type Theme } from "../types";

/**
 * Apply a theme by writing its color tokens to CSS custom properties on
 * `:root`. The variables override the defaults defined in `index.css` via
 * Tailwind's `@theme` block, so every utility class that references them
 * (e.g. `bg-canvas`, `text-fg`, `border-line`) updates instantly.
 *
 * Also syncs the document's `data-theme`, `data-appearance` attributes and
 * the native `color-scheme` so browser-controlled affordances (scrollbars,
 * form controls, autofill, etc.) match the active palette.
 */
export function applyTheme(theme: Theme): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    for (const token of THEME_COLOR_TOKENS) {
        root.style.setProperty(`--color-${token}`, theme.colors[token]);
    }

    root.setAttribute("data-theme", theme.id);
    root.setAttribute("data-appearance", theme.appearance);
    root.style.colorScheme = theme.appearance;
}
