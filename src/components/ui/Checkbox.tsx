import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, string> = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5"
};

const iconSizeStyles: Record<Size, string> = {
    sm: "size-2.5",
    md: "size-3",
    lg: "size-3.5"
};

type BaseCheckboxProps = React.ComponentProps<typeof BaseCheckbox.Root>;

export interface CheckboxProps extends Omit<BaseCheckboxProps, "className"> {
    size?: Size;
    className?: string;
    indicatorClassName?: string;
}

const CheckboxRoot = React.forwardRef<HTMLButtonElement, CheckboxProps>(
    (
        {
            size = "md",
            className,
            indicatorClassName,
            indeterminate,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <BaseCheckbox.Root
                ref={ref as React.Ref<HTMLButtonElement>}
                nativeButton
                render={<button type="button" />}
                indeterminate={indeterminate}
                disabled={disabled}
                className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-xs",
                    "bg-dark-700 border border-dark-500",
                    "transition-[background-color,border-color,transform] duration-150 ease-out",
                    "hover:bg-dark-600 hover:border-dark-400 active:scale-[0.98]",
                    "data-[checked]:bg-primary-100 data-[checked]:text-dark-950 data-[checked]:border-primary-100",
                    "data-[checked]:hover:bg-primary-300 data-[checked]:hover:border-primary-300",
                    "data-[indeterminate]:bg-primary-100 data-[indeterminate]:text-dark-950 data-[indeterminate]:border-primary-100",
                    "data-[indeterminate]:hover:bg-primary-200 data-[indeterminate]:hover:border-primary-200",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:active:scale-100",
                    "disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                <BaseCheckbox.Indicator
                    className={cn(
                        "inline-flex items-center justify-center",
                        "data-[unchecked]:hidden",
                        indicatorClassName
                    )}
                >
                    {indeterminate ? (
                        <MinusIcon
                            className={iconSizeStyles[size]}
                            weight="bold"
                            aria-hidden
                        />
                    ) : (
                        <CheckIcon
                            className={iconSizeStyles[size]}
                            weight="bold"
                            aria-hidden
                        />
                    )}
                </BaseCheckbox.Indicator>
            </BaseCheckbox.Root>
        );
    }
);

CheckboxRoot.displayName = "Checkbox";

type BaseCheckboxGroupProps = React.ComponentProps<typeof BaseCheckboxGroup>;

export interface CheckboxGroupProps
    extends Omit<BaseCheckboxGroupProps, "className"> {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

const orientationStyles: Record<
    NonNullable<CheckboxGroupProps["orientation"]>,
    string
> = {
    vertical: "flex-col gap-2",
    horizontal: "flex-row flex-wrap gap-x-4 gap-y-2"
};

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
    ({ orientation = "vertical", className, ...props }, ref) => {
        return (
            <BaseCheckboxGroup
                ref={ref}
                className={cn(
                    "flex text-sm text-primary-200",
                    "data-[disabled]:opacity-50",
                    orientationStyles[orientation],
                    className
                )}
                {...props}
            />
        );
    }
);

CheckboxGroup.displayName = "Checkbox.Group";

export const Checkbox = Object.assign(CheckboxRoot, {
    Group: CheckboxGroup
});
