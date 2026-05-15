import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const RadioSizeContext = React.createContext<Size>("md");

const rootSizeStyles: Record<Size, string> = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5"
};

const indicatorSizeStyles: Record<Size, string> = {
    sm: "before:size-1.5",
    md: "before:size-1.5",
    lg: "before:size-2"
};

type BaseRadioRootProps = React.ComponentProps<typeof BaseRadio.Root>;

export interface RadioProps extends Omit<BaseRadioRootProps, "className"> {
    size?: Size;
    className?: string;
    indicatorClassName?: string;
}

const RadioRoot = React.forwardRef<HTMLButtonElement, RadioProps>(
    (
        {
            size: sizeProp,
            className,
            indicatorClassName,
            disabled,
            ...props
        },
        ref
    ) => {
        const contextSize = React.useContext(RadioSizeContext);
        const size = sizeProp ?? contextSize;

        return (
            <BaseRadio.Root
                ref={ref as React.Ref<HTMLButtonElement>}
                nativeButton
                render={<button type="button" />}
                disabled={disabled}
                className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-full",
                    "bg-panel border border-line-strong",
                    "transition-[background-color,border-color,transform] duration-150 ease-out",
                    "hover:bg-muted hover:border-line-focus active:scale-[0.98]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-line-focus focus-visible:outline-offset-2",
                    "data-[checked]:bg-accent data-[checked]:border-accent",
                    "data-[checked]:hover:bg-accent-hover data-[checked]:hover:border-accent-hover",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:active:scale-100",
                    "disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
                    rootSizeStyles[size],
                    className
                )}
                {...props}
            >
                <BaseRadio.Indicator
                    className={cn(
                        "inline-flex items-center justify-center",
                        "before:block before:rounded-full before:bg-on-accent",
                        "before:transition-transform before:duration-150 before:ease-out",
                        "data-[unchecked]:before:scale-0",
                        "data-[checked]:before:scale-100",
                        indicatorSizeStyles[size],
                        indicatorClassName
                    )}
                />
            </BaseRadio.Root>
        );
    }
);

RadioRoot.displayName = "Radio";

type BaseRadioGroupProps = React.ComponentProps<typeof BaseRadioGroup>;

export interface RadioGroupProps
    extends Omit<BaseRadioGroupProps, "className"> {
    size?: Size;
    orientation?: "horizontal" | "vertical";
    className?: string;
}

const orientationStyles: Record<
    NonNullable<RadioGroupProps["orientation"]>,
    string
> = {
    vertical: "flex-col gap-2",
    horizontal: "flex-row flex-wrap gap-x-4 gap-y-2"
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ size = "md", orientation = "vertical", className, ...props }, ref) => {
        return (
            <RadioSizeContext.Provider value={size}>
                <BaseRadioGroup
                    ref={ref}
                    className={cn(
                        "flex text-sm text-fg",
                        "data-[disabled]:opacity-50",
                        orientationStyles[orientation],
                        className
                    )}
                    {...props}
                />
            </RadioSizeContext.Provider>
        );
    }
);

RadioGroup.displayName = "Radio.Group";

export const Radio = Object.assign(RadioRoot, {
    Group: RadioGroup
});
