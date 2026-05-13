import LayoutHeader from "./layout-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden overscroll-none">
            <LayoutHeader />
            {children}
        </div>
    );
}
