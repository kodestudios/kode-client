import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Select } from "@/components/ui";
import { SettingsItem } from "@/features/settings/components/settings-item";
import { useThemeStore } from "../stores";
import { getThemes } from "../utils";
import type { Theme } from "../types";

function ThemeAppearanceIcon({
    appearance
}: {
    appearance: Theme["appearance"];
}) {
    const Icon = appearance === "dark" ? MoonIcon : SunIcon;
    return (
        <Icon
            className="size-3.5 shrink-0 text-fg-subtle"
            weight="regular"
            aria-hidden
        />
    );
}

export function AppearanceSettings() {
    const themes = getThemes();
    const activeThemeId = useThemeStore((state) => state.themeId);
    const setTheme = useThemeStore((state) => state.setTheme);

    const activeTheme = themes.find((t) => t.id === activeThemeId) ?? themes[0];

    return (
        <div className="flex flex-col gap-2">
            <SettingsItem
                title="Theme"
                description="Choose the overall look and feel of Kode. The change applies instantly across the whole app."
            >
                <Select<string>
                    value={activeThemeId}
                    onValueChange={(value) => {
                        if (typeof value === "string") setTheme(value);
                    }}
                >
                    <Select.Trigger className="w-44">
                        <span className="flex min-w-0 flex-1 items-center gap-1.5">
                            <ThemeAppearanceIcon
                                appearance={activeTheme.appearance}
                            />
                            <Select.Value placeholder="Select theme" />
                        </span>
                        <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Positioner sideOffset={6} align="end">
                            <Select.Popup>
                                <Select.List>
                                    {themes.map((theme) => (
                                        <Select.Item
                                            key={theme.id}
                                            value={theme.id}
                                        >
                                            <Select.ItemIndicator />
                                            <span className="flex min-w-0 flex-1 items-center gap-1.5">
                                                <ThemeAppearanceIcon
                                                    appearance={
                                                        theme.appearance
                                                    }
                                                />
                                                <Select.ItemText>
                                                    {theme.name}
                                                </Select.ItemText>
                                            </span>
                                        </Select.Item>
                                    ))}
                                </Select.List>
                            </Select.Popup>
                        </Select.Positioner>
                    </Select.Portal>
                </Select>
            </SettingsItem>
        </div>
    );
}
