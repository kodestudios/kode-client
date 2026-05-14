import { useCallback } from "react";
import { useSidebarStore } from "@/features/sidebar";

export default function Sidebar() {
    const isOpen = useSidebarStore((state) => state.isOpen);
    const width = useSidebarStore((state) => state.width);
    const setWidth = useSidebarStore((state) => state.setWidth);

    const handleResizeStart = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            const startX = event.clientX;
            const startWidth = width;

            const handleMove = (moveEvent: MouseEvent) => {
                setWidth(startWidth + (moveEvent.clientX - startX));
            };

            const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
            };

            document.addEventListener("mousemove", handleMove);
            document.addEventListener("mouseup", handleUp);
            document.body.style.userSelect = "none";
            document.body.style.cursor = "col-resize";
        },
        [setWidth, width]
    );

    if (!isOpen) {
        return null;
    }

    return (
        <div
            style={{ width }}
            className="relative flex shrink-0 overflow-hidden rounded-sm bg-dark-950 h-full"
        >
            <div
                role="separator"
                aria-orientation="vertical"
                onMouseDown={handleResizeStart}
                className="absolute top-0 right-0 h-full w-1 cursor-col-resize select-none"
            />
        </div>
    );
}
