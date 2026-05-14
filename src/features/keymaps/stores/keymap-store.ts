import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Keybinding, KeymapContext, KeymapStore } from "../types";

interface KeymapState extends KeymapStore {
    recordingCommandId: string | null;
    actions: {
        addKeybinding: (keybinding: Keybinding) => void;
        removeKeybinding: (commandId: string) => void;
        updateKeybinding: (
            commandId: string,
            updates: Partial<Keybinding>
        ) => void;
        resetToDefaults: () => void;
        setContext: <K extends keyof KeymapContext>(
            key: K,
            value: KeymapContext[K]
        ) => void;
        setContexts: (contexts: Partial<KeymapContext>) => void;
        startRecording: (commandId: string) => void;
        stopRecording: () => void;
    };
}

const initialContexts: Partial<KeymapContext> = {
    editorFocus: false,
    terminalFocus: false,
    sidebarFocus: false,
    hasSelection: false,
    isRecordingKeybinding: false
};

export const useKeymapStore = create<KeymapState>()(
    persist(
        (set) => ({
            keybindings: [],
            recordingCommandId: null,
            contexts: initialContexts,
            actions: {
                addKeybinding: (keybinding) =>
                    set((state) => {
                        const userKeybinding: Keybinding = {
                            ...keybinding,
                            source: "user"
                        };

                        return {
                            keybindings: [
                                ...state.keybindings.filter(
                                    (kb) => kb.command !== userKeybinding.command
                                ),
                                userKeybinding
                            ]
                        };
                    }),
                removeKeybinding: (commandId) =>
                    set((state) => ({
                        keybindings: state.keybindings.filter(
                            (kb) => kb.command !== commandId
                        )
                    })),
                updateKeybinding: (commandId, updates) =>
                    set((state) => ({
                        keybindings: state.keybindings.map((kb) =>
                            kb.command === commandId
                                ? { ...kb, ...updates }
                                : kb
                        )
                    })),
                resetToDefaults: () =>
                    set(() => ({
                        keybindings: []
                    })),
                setContext: (key, value) =>
                    set((state) => ({
                        contexts: { ...state.contexts, [key]: value }
                    })),
                setContexts: (contexts) =>
                    set((state) => ({
                        contexts: { ...state.contexts, ...contexts }
                    })),
                startRecording: (commandId) =>
                    set((state) => ({
                        recordingCommandId: commandId,
                        contexts: {
                            ...state.contexts,
                            isRecordingKeybinding: true
                        }
                    })),
                stopRecording: () =>
                    set((state) => ({
                        recordingCommandId: null,
                        contexts: {
                            ...state.contexts,
                            isRecordingKeybinding: false
                        }
                    }))
            }
        }),
        {
            name: "kode:keymaps",
            partialize: (state) => ({
                keybindings: state.keybindings.filter(
                    (kb) => kb.source === "user"
                )
            })
        }
    )
);
