import { cn } from "@/lib/cn";
import {
    settingsCategories,
    type SettingsCategory
} from "./settings-categories";

type SettingsSidebarProps = {
    activeCategory: SettingsCategory;
    onCategoryChange: (category: SettingsCategory) => void;
};

export function SettingsSidebar({
    activeCategory,
    onCategoryChange
}: SettingsSidebarProps) {
    return (
        <aside className="h-full max-w-[20%] w-full">
            <nav
                className="flex flex-col gap-1"
                aria-label="Settings categories"
            >
                {settingsCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            aria-current={
                                activeCategory === category.id
                                    ? "page"
                                    : undefined
                            }
                            onClick={() => onCategoryChange(category.id)}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-xs px-2 py-1.5 text-left text-xs outline-none",
                                "transition-colors duration-100 ease-out",
                                "hover:bg-panel hover:text-fg focus-visible:bg-panel",
                                activeCategory === category.id
                                    ? "bg-panel text-fg"
                                    : "text-fg-muted"
                            )}
                        >
                            <Icon
                                className="size-3.5 shrink-0"
                                weight={
                                    activeCategory === category.id
                                        ? "bold"
                                        : "regular"
                                }
                                aria-hidden
                            />
                            <span className="min-w-0 truncate">
                                {category.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}