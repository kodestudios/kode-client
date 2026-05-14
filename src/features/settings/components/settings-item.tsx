import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SettingsItemProps = {
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
    contentClassName?: string;
    actionsClassName?: string;
};

export function SettingsItem({
    title,
    description,
    children,
    className,
    contentClassName,
    actionsClassName
}: SettingsItemProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-4 p-2.5",
                className
            )}
        >
            <div className={cn("min-w-0 flex-1", contentClassName)}>
                <div className="text-sm font-medium text-dark-50">{title}</div>
                {description && (
                    <div className="mt-1 text-xs leading-5 text-dark-200">
                        {description}
                    </div>
                )}
            </div>
            {children && (
                <div
                    className={cn(
                        "flex shrink-0 items-center justify-end",
                        actionsClassName
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
