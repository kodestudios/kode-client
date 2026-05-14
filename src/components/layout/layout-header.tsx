import { type ButtonHTMLAttributes, type ReactNode, useEffect, useState } from "react";
import {
    CopyIcon,
    GearIcon,
    MinusIcon,
    SidebarSimpleIcon,
    SquareIcon,
    XIcon
} from "@phosphor-icons/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useSettingsStore } from "@/features/settings";
import { useSidebarStore } from "@/features/sidebar";
import { useOS } from "@/hooks/use-os";
import { cn } from "@/lib/cn";
import { FileMenu } from "./file-menu";

export default function LayoutHeader() {
    const os = useOS();
    const [isMaximized, setIsMaximized] = useState(false);
    const appWindow = getCurrentWindow();
    const hasRightWindowControls = os === "windows" || os === "linux";
    const isSidebarOpen = useSidebarStore((state) => state.isOpen);
    const toggleSidebar = useSidebarStore((state) => state.toggle);
    const toggleSettings = useSettingsStore((state) => state.toggle);

    useEffect(() => {
        const checkMaximized = async () => {
            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);
        };

        void checkMaximized();

        const unlisten = appWindow.onResized(async () => {
            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);
        });

        return () => {
            unlisten.then((fn) => fn());
        };
    }, [appWindow]);

    const handleMinimize = async () => {
        await appWindow.minimize();
    };

    const handleMaximize = async () => {
        await appWindow.toggleMaximize();
    };

    const handleClose = async () => {
        await appWindow.close();
    };

    return (
        <header
            data-tauri-drag-region
            className="flex h-8 shrink-0 items-center justify-between pl-4"
            onDoubleClick={() => {
                void handleMaximize();
            }}
        >
            <div className="flex items-center gap-2">
                {os === "macos" && (
                    <div className="mr-2 flex items-center gap-2">
                        <MacWindowControlButton
                            variant="close"
                            onClick={() => {
                                void handleClose();
                            }}
                        />
                        <MacWindowControlButton
                            variant="minimize"
                            onClick={() => {
                                void handleMinimize();
                            }}
                        />
                        <MacWindowControlButton
                            variant="maximize"
                            onClick={() => {
                                void handleMaximize();
                            }}
                        />
                    </div>
                )}
                {os !== "macos" && <FileMenu />}
            </div>
            <div className="flex items-center gap-2">
                <HeaderIconButton
                    onClick={toggleSidebar}
                    aria-pressed={isSidebarOpen}
                >
                    <SidebarSimpleIcon
                        className="size-4"
                        weight={isSidebarOpen ? "bold" : "regular"}
                    />
                </HeaderIconButton>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 pr-2">
                <HeaderIconButton onClick={toggleSettings} aria-label="Open settings">
                    <GearIcon className="size-4" />
                </HeaderIconButton>
            </div>
            <div className="flex items-stretch self-stretch">
                {hasRightWindowControls && (
                    <div className="flex items-stretch self-stretch pl-2">
                        <WindowControlButton
                            onClick={() => {
                                void handleMinimize();
                            }}
                        >
                            <MinusIcon className="size-3.5" weight="bold" />
                        </WindowControlButton>
                        <WindowControlButton
                            onClick={() => {
                                void handleMaximize();
                            }}
                        >
                            {isMaximized ? (
                                <CopyIcon className="size-3.5" weight="bold" />
                            ) : (
                                <SquareIcon
                                    className="size-3.5"
                                    weight="bold"
                                />
                            )}
                        </WindowControlButton>
                        <WindowControlButton
                            danger
                            onClick={() => {
                                void handleClose();
                            }}
                        >
                            <XIcon className="size-3.5" weight="bold" />
                        </WindowControlButton>
                    </div>
                )}
            </div>
        </header>
    );
}

interface MacWindowControlButtonProps {
    variant: "close" | "minimize" | "maximize";
    onClick: () => void;
}

const macWindowControlStyles = {
    close: "bg-[#ff5f57] border-[#e0443e]",
    minimize: "bg-[#ffbd2e] border-[#dea123]",
    maximize: "bg-[#28c840] border-[#1aab29]"
} as const;

function MacWindowControlButton({
    variant,
    onClick
}: MacWindowControlButtonProps) {
    return (
        <button
            type="button"
            aria-label={`${variant} window`}
            className={cn(
                "size-3 rounded-full border transition brightness-95 hover:brightness-110",
                macWindowControlStyles[variant]
            )}
            onClick={onClick}
            onMouseDown={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
        />
    );
}

interface HeaderIconButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    children: ReactNode;
    onClick: () => void;
}

function HeaderIconButton({
    children,
    onClick,
    ...rest
}: HeaderIconButtonProps) {
    return (
        <button
            type="button"
            className="flex size-6 items-center justify-center rounded-xs text-dark-100 transition-colors duration-150 hover:bg-dark-700 hover:text-dark-50 aria-pressed:text-dark-50"
            onClick={onClick}
            onMouseDown={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            {...rest}
        >
            {children}
        </button>
    );
}

interface WindowControlButtonProps {
    children: ReactNode;
    danger?: boolean;
    onClick: () => void;
}

function WindowControlButton({
    children,
    danger = false,
    onClick
}: WindowControlButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                "flex h-full w-10 items-center justify-center self-stretch text-dark-100 transition-colors duration-150 hover:bg-dark-900 hover:text-dark-50",
                danger &&
                    "hover:border-red-500/30 hover:bg-red-600 hover:text-white"
            )}
            onClick={onClick}
            onMouseDown={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
        >
            {children}
        </button>
    );
}
