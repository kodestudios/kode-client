import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-active",
    secondary: "bg-panel text-fg hover:bg-muted active:bg-strong",
    ghost: "bg-transparent text-fg hover:bg-strong active:bg-emphasis",
    outline:
        "bg-transparent text-fg border border-line hover:bg-strong active:bg-strong",
    destructive: "bg-red-500 text-fg hover:bg-red-600 active:bg-red-700"
};

const sizeStyles: Record<Size, string> = {
    sm: "h-6 gap-1 px-2 text-xs",
    md: "h-8 gap-2 px-2.5 text-sm",
    lg: "h-10 gap-2.5 px-3 text-sm",
    icon: "size-8"
};

type BaseButtonProps = React.ComponentProps<typeof BaseButton>;

export interface ButtonProps extends Omit<BaseButtonProps, "className"> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "secondary",
            size = "md",
            loading = false,
            leftIcon,
            rightIcon,
            disabled,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <BaseButton
                ref={ref}
                disabled={isDisabled}
                focusableWhenDisabled={loading}
                className={cn(
                    "relative inline-flex shrink-0 select-none items-center justify-center rounded-xs",
                    "font-medium whitespace-nowrap active:scale-[0.98]",
                    "transition-[background-color,color,box-shadow,transform] duration-150 ease-out",
                    "disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:active:scale-100",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {loading ? (
                    <CircleNotchIcon
                        className="size-3.5 animate-spin"
                        weight="bold"
                        aria-hidden
                    />
                ) : (
                    leftIcon && (
                        <span className="-ml-0.5 inline-flex shrink-0">
                            {leftIcon}
                        </span>
                    )
                )}
                {children}
                {!loading && rightIcon && (
                    <span className="-mr-0.5 inline-flex shrink-0">
                        {rightIcon}
                    </span>
                )}
            </BaseButton>
        );
    }
);

Button.displayName = "Button";
