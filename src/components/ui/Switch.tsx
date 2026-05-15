import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const rootSizeStyles: Record<Size, string> = {
    sm: "h-4 w-7",
    md: "h-5 w-9",
    lg: "h-6 w-11"
};

const thumbSizeStyles: Record<Size, string> = {
    sm: "size-2.5 translate-x-[2px] data-[checked]:translate-x-[14px]",
    md: "size-3 translate-x-[3px] data-[checked]:translate-x-[19px]",
    lg: "size-4 translate-x-[3px] data-[checked]:translate-x-[23px]"
};

type BaseSwitchRootProps = React.ComponentProps<typeof BaseSwitch.Root>;

export interface SwitchProps extends Omit<BaseSwitchRootProps, "className"> {
    size?: Size;
    className?: string;
    thumbClassName?: string;
}

const SwitchRoot = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ size = "md", className, thumbClassName, disabled, ...props }, ref) => {
        return (
            <BaseSwitch.Root
                ref={ref as React.Ref<HTMLButtonElement>}
                nativeButton
                render={<button type="button" />}
                disabled={disabled}
                className={cn(
                    "group relative inline-flex shrink-0 items-center rounded-full",
                    "border border-line bg-canvas",
                    "transition-colors duration-150 ease-out",
                    "hover:border-line-strong",
                    "data-[checked]:border-accent-strong data-[checked]:bg-accent",
                    "data-[checked]:hover:bg-accent-subtle",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-line-focus focus-visible:outline-offset-2",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    rootSizeStyles[size],
                    className
                )}
                {...props}
            >
                <BaseSwitch.Thumb
                    className={cn(
                        "block rounded-full bg-fg shadow-sm",
                        "transition-all duration-200 ease-out",
                        "data-[checked]:bg-on-accent",
                        thumbSizeStyles[size],
                        thumbClassName
                    )}
                />
            </BaseSwitch.Root>
        );
    }
);

SwitchRoot.displayName = "Switch";

export const Switch = SwitchRoot;
