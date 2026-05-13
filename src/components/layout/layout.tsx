import LayoutHeader from "./layout-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <LayoutHeader />
            {children}
        </div>
    );
}
