import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const wrapperSizeStyles: Record<Size, string> = {
    sm: "h-6 gap-1 px-2 text-xs",
    md: "h-8 gap-2 px-2.5 text-sm",
    lg: "h-10 gap-2.5 px-3 text-sm"
};

const inputSizeStyles: Record<Size, string> = {
    sm: "h-6 px-2 text-xs",
    md: "h-8 px-2.5 text-sm",
    lg: "h-10 px-3 text-sm"
};

const adornmentColor = "text-dark-200";

type BaseInputProps = React.ComponentProps<typeof BaseInput>;

export interface InputProps extends Omit<BaseInputProps, "className" | "size"> {
    size?: Size;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    invalid?: boolean;
    className?: string;
    wrapperClassName?: string;
}

const baseSurface = [
    "bg-dark-700 text-dark-50",
    "border border-dark-600",
    "transition-[background-color,border-color,color] duration-150 ease-out",
    "hover:border-dark-500",
    "data-[invalid]:border-red-500 aria-invalid:border-red-500",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "disabled:pointer-events-none disabled:opacity-50"
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size = "md",
            leftIcon,
            rightIcon,
            invalid,
            disabled,
            className,
            wrapperClassName,
            ...props
        },
        ref
    ) => {
        if (leftIcon || rightIcon) {
            return (
                <div
                    data-disabled={disabled || undefined}
                    data-invalid={invalid || undefined}
                    className={cn(
                        "group relative inline-flex w-full items-center rounded-xs",
                        baseSurface,
                        "focus-within:border-dark-400",
                        "data-[invalid]:focus-within:border-red-500",
                        wrapperSizeStyles[size],
                        wrapperClassName
                    )}
                >
                    {leftIcon && (
                        <span
                            className={cn(
                                "-ml-0.5 inline-flex shrink-0 items-center justify-center",
                                adornmentColor
                            )}
                            aria-hidden
                        >
                            {leftIcon}
                        </span>
                    )}
                    <BaseInput
                        ref={ref}
                        disabled={disabled}
                        aria-invalid={invalid || undefined}
                        className={cn(
                            "min-w-0 flex-1 bg-transparent text-dark-50 outline-none",
                            "placeholder:text-dark-200",
                            "disabled:cursor-not-allowed",
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <span
                            className={cn(
                                "-mr-0.5 inline-flex shrink-0 items-center justify-center",
                                adornmentColor
                            )}
                            aria-hidden
                        >
                            {rightIcon}
                        </span>
                    )}
                </div>
            );
        }

        return (
            <BaseInput
                ref={ref}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={cn(
                    "block w-full rounded-xs",
                    baseSurface,
                    "placeholder:text-dark-200",
                    "focus:border-dark-400 data-[focused]:border-dark-400",
                    "data-[invalid]:focus:border-red-500",
                    "disabled:cursor-not-allowed",
                    inputSizeStyles[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
