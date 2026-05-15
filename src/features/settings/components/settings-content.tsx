import { AppearanceSettings } from "@/features/themes";
import type { SettingsCategory } from "./settings-categories";
import { GeneralSettings } from "./general-settings";

type SettingsContentProps = {
    activeCategory: SettingsCategory;
};

export function SettingsContent({ activeCategory }: SettingsContentProps) {
    return (
        <section className="min-w-0 flex-1 overflow-auto">
            <div className="mt-3">
                {activeCategory === "general" && <GeneralSettings />}
                {activeCategory === "appearance" && <AppearanceSettings />}
                {activeCategory === "account" && (
                    <p className="text-xs text-fg-subtle">
                        Account settings will appear here.
                    </p>
                )}
            </div>
        </section>
    );
}
