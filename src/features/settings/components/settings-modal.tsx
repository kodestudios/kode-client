import { useState } from "react";
import { Modal } from "@/components/ui";
import { SettingsContent } from "./settings-content";
import { SettingsSidebar } from "./settings-sidebar";
import type { SettingsCategory } from "./settings-categories";
import { useSettingsStore } from "../stores";

export function SettingsModal() {
    const isOpen = useSettingsStore((state) => state.isOpen);
    const setOpen = useSettingsStore((state) => state.setOpen);
    const [activeCategory, setActiveCategory] =
        useState<SettingsCategory>("general");

    return (
        <Modal
            open={isOpen}
            onOpenChange={setOpen}
            title="Settings"
            size="xl"
            className="h-[60vh] max-h-[60vh] w-[50vw] max-w-[50vw] overflow-hidden p-2"
            bodyClassName="h-full overflow-hidden"
        >
            <div className="flex gap-2 h-full min-h-0 overflow-hidden">
                <SettingsSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
                <SettingsContent activeCategory={activeCategory} />
            </div>
        </Modal>
    );
}
