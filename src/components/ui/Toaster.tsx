import { Toaster as SonnerToaster } from "sonner";
import { useThemeStore } from "@/features/themes";
import { getTheme } from "@/features/themes";

export function Toaster() {
    const themeId = useThemeStore((state) => state.themeId);
    const appearance = getTheme(themeId)?.appearance ?? "dark";

    return (
        <SonnerToaster
            position="bottom-right"
            theme={appearance}
            expand
            gap={8}
            offset={16}
            visibleToasts={6}
            toastOptions={{
                duration: 4500,
                classNames: {
                    toast: "bg-elevated border-line text-fg",
                    title: "text-fg",
                    description: "text-fg-muted",
                    actionButton: "bg-accent text-on-accent",
                    cancelButton: "bg-muted text-fg"
                }
            }}
        />
    );
}