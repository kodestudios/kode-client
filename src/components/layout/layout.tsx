import LayoutHeader from "./layout-header";
import LayoutFooter from "./layout-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden overscroll-none">
            <LayoutHeader />
            <main className="flex-1 px-4">{children}</main>
            <LayoutFooter />
        </div>
    );
}
