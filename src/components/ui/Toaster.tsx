import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            theme="dark"
            expand
            gap={8}
            offset={16}
            visibleToasts={6}
            toastOptions={{
                duration: 4500,
                classNames: {
                    toast: "bg-dark-850 border-dark-600 text-dark-50",
                    title: "text-primary-100",
                    description: "text-dark-100",
                    actionButton: "bg-primary-100 text-dark-950",
                    cancelButton: "bg-dark-600 text-dark-50"
                }
            }}
        />
    );
}