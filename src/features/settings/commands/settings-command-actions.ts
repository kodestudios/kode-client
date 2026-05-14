import { useSettingsStore } from "../stores";

export function openSettingsAction(): void {
    useSettingsStore.getState().open();
}