import { GearIcon, PaintBrushIcon, UserIcon } from "@phosphor-icons/react";

export const settingsCategories = [
    { id: "general", label: "General", icon: GearIcon },
    { id: "appearance", label: "Appearance", icon: PaintBrushIcon },
    { id: "account", label: "Account", icon: UserIcon }
] as const;

export type SettingsCategory = (typeof settingsCategories)[number]["id"];
