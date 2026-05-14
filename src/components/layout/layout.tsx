import LayoutHeader from "./layout-header";
import LayoutFooter from "./layout-footer";
import { SettingsModal } from "@/features/settings";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden overscroll-none">
            <LayoutHeader />
            <main className="flex w-full h-full items-center gap-4 flex-1 px-4">
                {children}
            </main>
            <LayoutFooter />
            <SettingsModal />
        </div>
    );
}
