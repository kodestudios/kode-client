import {
    settingsCategories,
    type SettingsCategory
} from "./settings-categories";

type SettingsContentProps = {
    activeCategory: SettingsCategory;
};

export function SettingsContent({ activeCategory }: SettingsContentProps) {
    const activeCategoryLabel = settingsCategories.find(
        (category) => category.id === activeCategory
    )?.label;

    return (
        <section className="min-w-0 flex-1 overflow-auto pl-4">
            <h2 className="text-sm font-medium text-dark-50">
                {activeCategoryLabel}
            </h2>
            <p className="mt-1 text-xs text-dark-200">
                {activeCategory === "general"
                    ? "General settings will appear here."
                    : "Account settings will appear here."}
            </p>
        </section>
    );
}