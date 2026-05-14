import { useSidebarStore } from "@/features/sidebar";

export function toggleSidebarAction(): void {
    useSidebarStore.getState().toggle();
}