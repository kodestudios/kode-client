import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <Toaster />
        </>
    );
}
