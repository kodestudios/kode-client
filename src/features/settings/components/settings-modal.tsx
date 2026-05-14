import { Modal } from "@/components/ui";
import { useSettingsStore } from "../stores";

export function SettingsModal() {
    const isOpen = useSettingsStore((state) => state.isOpen);
    const setOpen = useSettingsStore((state) => state.setOpen);

    return (
        <Modal
            open={isOpen}
            onOpenChange={setOpen}
            title="Settings"
            size="xl"
            className="h-[70vh] max-h-[70vh] w-[60vw] max-w-[60vw]"
            bodyClassName="h-full"
        />
    );
}