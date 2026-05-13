import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const NumberFieldSizeContext = React.createContext<Size>("md");

const groupSizeStyles: Record<Size, string> = {
    sm: "h-6 text-xs",
    md: "h-8 text-sm",
    lg: "h-10 text-sm"
};

const stepperSizeStyles: Record<Size, string> = {
    sm: "w-6",
    md: "w-7",
    lg: "w-8"
};

const inputPaddingStyles: Record<Size, string> = {
    sm: "px-1.5",
    md: "px-2",
    lg: "px-2.5"
};

const stepperIconSizeStyles: Record<Size, string> = {
    sm: "size-3",
    md: "size-3.5",
    lg: "size-4"
};

type BaseNumberFieldRootProps = React.ComponentProps<typeof BaseNumberField.Root>;
type BaseNumberFieldScrubAreaProps = React.ComponentProps<
    typeof BaseNumberField.ScrubArea
>;
type BaseNumberFieldScrubAreaCursorProps = React.ComponentProps<
    typeof BaseNumberField.ScrubAreaCursor
>;
type BaseNumberFieldGroupProps = React.ComponentProps<
    typeof BaseNumberField.Group
>;
type BaseNumberFieldInputProps = React.ComponentProps<
    typeof BaseNumberField.Input
>;
type BaseNumberFieldDecrementProps = React.ComponentProps<
    typeof BaseNumberField.Decrement
>;
type BaseNumberFieldIncrementProps = React.ComponentProps<
    typeof BaseNumberField.Increment
>;

export interface NumberFieldRootProps
    extends Omit<BaseNumberFieldRootProps, "className"> {
    size?: Size;
    className?: string;
}

function NumberFieldRoot({
    size = "md",
    className,
    ...props
}: NumberFieldRootProps) {
    return (
        <NumberFieldSizeContext.Provider value={size}>
            <BaseNumberField.Root
                className={cn(
                    "inline-flex w-fit flex-col gap-1.5",
                    "data-[disabled]:cursor-not-allowed",
                    className
                )}
                {...props}
            />
        </NumberFieldSizeContext.Provider>
    );
}
NumberFieldRoot.displayName = "NumberField";

export interface NumberFieldScrubAreaProps
    extends Omit<BaseNumberFieldScrubAreaProps, "className"> {
    className?: string;
}

const NumberFieldScrubArea = React.forwardRef<
    HTMLSpanElement,
    NumberFieldScrubAreaProps
>(({ className, direction = "horizontal", ...props }, ref) => (
    <BaseNumberField.ScrubArea
        ref={ref}
        direction={direction}
        className={cn(
            "inline-flex w-fit select-none items-center gap-1",
            "text-xs font-medium text-dark-100",
            direction === "vertical"
                ? "cursor-ns-resize"
                : "cursor-ew-resize",
            "data-[disabled]:cursor-not-allowed",
            className
        )}
        {...props}
    />
));
NumberFieldScrubArea.displayName = "NumberField.ScrubArea";

export interface NumberFieldScrubAreaCursorProps
    extends Omit<BaseNumberFieldScrubAreaCursorProps, "className"> {
    className?: string;
}

const NumberFieldScrubAreaCursor = React.forwardRef<
    HTMLSpanElement,
    NumberFieldScrubAreaCursorProps
>(({ className, children, ...props }, ref) => (
    <BaseNumberField.ScrubAreaCursor
        ref={ref}
        className={cn(
            "pointer-events-none z-50 inline-flex items-center justify-center",
            "text-dark-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]",
            className
        )}
        {...props}
    >
        {children ?? <CursorGrowIcon className="size-5" />}
    </BaseNumberField.ScrubAreaCursor>
));
NumberFieldScrubAreaCursor.displayName = "NumberField.ScrubAreaCursor";

export interface NumberFieldGroupProps
    extends Omit<BaseNumberFieldGroupProps, "className"> {
    className?: string;
}

const NumberFieldGroup = React.forwardRef<
    HTMLDivElement,
    NumberFieldGroupProps
>(({ className, ...props }, ref) => {
    const size = React.useContext(NumberFieldSizeContext);
    return (
        <BaseNumberField.Group
            ref={ref}
            className={cn(
                "inline-flex w-full select-none items-stretch overflow-hidden rounded-xs",
                "bg-dark-700 text-dark-50 border border-dark-600",
                "transition-[background-color,border-color,color] duration-150 ease-out",
                "hover:border-dark-500",
                "focus-within:border-dark-400",
                "data-[scrubbing]:border-dark-400",
                "data-[invalid]:border-red-500 data-[invalid]:focus-within:border-red-500",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                groupSizeStyles[size],
                className
            )}
            {...props}
        />
    );
});
NumberFieldGroup.displayName = "NumberField.Group";

const stepperBaseClassName = cn(
    "inline-flex shrink-0 items-center justify-center",
    "text-dark-100",
    "transition-colors duration-100 ease-out",
    "hover:bg-dark-600 hover:text-dark-50",
    "active:bg-dark-500",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dark-300 focus-visible:-outline-offset-2",
    "disabled:cursor-not-allowed disabled:text-dark-300 disabled:hover:bg-transparent",
    "data-[disabled]:cursor-not-allowed data-[disabled]:text-dark-300 data-[disabled]:hover:bg-transparent"
);

// Wrapping a NumberField inside a <label> (e.g. a generic field/label wrapper)
// causes the browser to forward clicks on the label to the first labelable
// descendant — which is whichever stepper button comes first in the DOM. That
// makes clicks on the field label or surrounding label padding silently flash
// the stepper as active, step the value, and leave the button focused (which
// also triggers `:focus-visible`, painting the stepper as if it were hovered).
// Real pointer/keyboard activations of the button always have `detail >= 1`;
// synthetic label-forwarded clicks have `detail === 0`, so we cancel just
// those in the capture phase before Base UI's internal click handler runs and
// move focus to the input where the user actually intended to interact.
function ignoreLabelForwardedClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (event.detail !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const input = button.parentElement?.querySelector<HTMLInputElement>("input");
    if (input) {
        input.focus();
    } else {
        button.blur();
    }
}

export interface NumberFieldDecrementProps
    extends Omit<BaseNumberFieldDecrementProps, "className"> {
    className?: string;
}

const NumberFieldDecrement = React.forwardRef<
    HTMLButtonElement,
    NumberFieldDecrementProps
>(({ className, children, onClickCapture, ...props }, ref) => {
    const size = React.useContext(NumberFieldSizeContext);
    return (
        <BaseNumberField.Decrement
            ref={ref}
            onClickCapture={(event) => {
                ignoreLabelForwardedClick(event);
                onClickCapture?.(event);
            }}
            className={cn(
                stepperBaseClassName,
                "border-r border-dark-600",
                stepperSizeStyles[size],
                className
            )}
            {...props}
        >
            {children ?? (
                <MinusIcon
                    className={stepperIconSizeStyles[size]}
                    weight="bold"
                    aria-hidden
                />
            )}
        </BaseNumberField.Decrement>
    );
});
NumberFieldDecrement.displayName = "NumberField.Decrement";

export interface NumberFieldIncrementProps
    extends Omit<BaseNumberFieldIncrementProps, "className"> {
    className?: string;
}

const NumberFieldIncrement = React.forwardRef<
    HTMLButtonElement,
    NumberFieldIncrementProps
>(({ className, children, onClickCapture, ...props }, ref) => {
    const size = React.useContext(NumberFieldSizeContext);
    return (
        <BaseNumberField.Increment
            ref={ref}
            onClickCapture={(event) => {
                ignoreLabelForwardedClick(event);
                onClickCapture?.(event);
            }}
            className={cn(
                stepperBaseClassName,
                "border-l border-dark-600",
                stepperSizeStyles[size],
                className
            )}
            {...props}
        >
            {children ?? (
                <PlusIcon
                    className={stepperIconSizeStyles[size]}
                    weight="bold"
                    aria-hidden
                />
            )}
        </BaseNumberField.Increment>
    );
});
NumberFieldIncrement.displayName = "NumberField.Increment";

export interface NumberFieldInputProps
    extends Omit<BaseNumberFieldInputProps, "className"> {
    className?: string;
}

const NumberFieldInput = React.forwardRef<
    HTMLInputElement,
    NumberFieldInputProps
>(({ className, ...props }, ref) => {
    const size = React.useContext(NumberFieldSizeContext);
    return (
        <BaseNumberField.Input
            ref={ref}
            className={cn(
                "min-w-0 flex-1 self-stretch bg-transparent",
                "text-center tabular-nums text-dark-50 outline-none",
                "placeholder:text-dark-200",
                "disabled:cursor-not-allowed",
                inputPaddingStyles[size],
                className
            )}
            {...props}
        />
    );
});
NumberFieldInput.displayName = "NumberField.Input";

function CursorGrowIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg
            viewBox="0 0 26 14"
            fill="currentColor"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="1"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            {...props}
        >
            <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
        </svg>
    );
}

export const NumberField = Object.assign(NumberFieldRoot, {
    ScrubArea: NumberFieldScrubArea,
    ScrubAreaCursor: NumberFieldScrubAreaCursor,
    Group: NumberFieldGroup,
    Decrement: NumberFieldDecrement,
    Input: NumberFieldInput,
    Increment: NumberFieldIncrement
});
