import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SIDEBAR_MIN_WIDTH = 180;
export const SIDEBAR_MAX_WIDTH = 680;
export const SIDEBAR_DEFAULT_WIDTH = 240;

interface SidebarState {
    isOpen: boolean;
    width: number;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setWidth: (width: number) => void;
}

const clampWidth = (width: number) =>
    Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width));

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            width: SIDEBAR_DEFAULT_WIDTH,
            open: () => set({ isOpen: true }),
            close: () => set({ isOpen: false }),
            toggle: () => set((state) => ({ isOpen: !state.isOpen })),
            setWidth: (width) => set({ width: clampWidth(width) })
        }),
        {
            name: "kode:sidebar",
            partialize: (state) => ({ isOpen: state.isOpen, width: state.width }),
            merge: (persistedState, currentState) => {
                const sidebarState = persistedState as Partial<SidebarState>;

                return {
                    ...currentState,
                    ...sidebarState,
                    width:
                        typeof sidebarState.width === "number"
                            ? clampWidth(sidebarState.width)
                            : currentState.width,
                    isOpen:
                        typeof sidebarState.isOpen === "boolean"
                            ? sidebarState.isOpen
                            : currentState.isOpen
                };
            }
        }
    )
);
