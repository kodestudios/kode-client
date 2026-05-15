import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import {
    CaretDownIcon,
    CaretUpDownIcon,
    CaretUpIcon,
    CheckIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const triggerSizeStyles: Record<Size, string> = {
    sm: "h-6 gap-1 px-2 text-xs",
    md: "h-8 gap-2 px-2.5 text-sm",
    lg: "h-10 gap-2.5 px-3 text-sm"
};

type BaseSelectLabelProps = React.ComponentProps<typeof BaseSelect.Label>;
type BaseSelectTriggerProps = React.ComponentProps<typeof BaseSelect.Trigger>;
type BaseSelectValueProps = React.ComponentProps<typeof BaseSelect.Value>;
type BaseSelectIconProps = React.ComponentProps<typeof BaseSelect.Icon>;
type BaseSelectBackdropProps = React.ComponentProps<typeof BaseSelect.Backdrop>;
type BaseSelectPortalProps = React.ComponentProps<typeof BaseSelect.Portal>;
type BaseSelectPositionerProps = React.ComponentProps<
    typeof BaseSelect.Positioner
>;
type BaseSelectPopupProps = React.ComponentProps<typeof BaseSelect.Popup>;
type BaseSelectListProps = React.ComponentProps<typeof BaseSelect.List>;
type BaseSelectArrowProps = React.ComponentProps<typeof BaseSelect.Arrow>;
type BaseSelectItemProps = React.ComponentProps<typeof BaseSelect.Item>;
type BaseSelectItemTextProps = React.ComponentProps<typeof BaseSelect.ItemText>;
type BaseSelectItemIndicatorProps = React.ComponentProps<
    typeof BaseSelect.ItemIndicator
>;
type BaseSelectGroupProps = React.ComponentProps<typeof BaseSelect.Group>;
type BaseSelectGroupLabelProps = React.ComponentProps<
    typeof BaseSelect.GroupLabel
>;
type BaseSelectScrollUpArrowProps = React.ComponentProps<
    typeof BaseSelect.ScrollUpArrow
>;
type BaseSelectScrollDownArrowProps = React.ComponentProps<
    typeof BaseSelect.ScrollDownArrow
>;
type BaseSelectSeparatorProps = React.ComponentProps<
    typeof BaseSelect.Separator
>;

const triggerBaseClassName = cn(
    "inline-flex w-full select-none items-center justify-between rounded-xs",
    "bg-panel text-fg border border-line",
    "transition-[background-color,border-color,color] duration-150 ease-out",
    "hover:border-line-strong",
    "data-[popup-open]:border-line-focus data-[focused]:border-line-focus",
    "data-[invalid]:border-red-500",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const popupBaseClassName = cn(
    "min-w-[var(--anchor-width)] max-h-[var(--available-height)] overflow-y-auto outline-none",
    "bg-elevated text-fg border border-line",
    "rounded-xs shadow-lg shadow-black/40",
    "p-1",
    "[transform-origin:var(--transform-origin)]",
    "transition-[opacity,transform,scale] duration-150 ease-out",
    "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
    "data-[ending-style]:opacity-0 data-[ending-style]:scale-95"
);

const itemBaseClassName = cn(
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-xs py-1.5 pr-2.5 pl-7 text-xs text-fg outline-none",
    "transition-colors duration-100 ease-out",
    "data-[highlighted]:bg-panel",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const indicatorWrapperClassName = cn(
    "absolute left-1.5 inline-flex size-4 shrink-0 items-center justify-center text-fg",
    "transition-opacity duration-100 ease-out",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
);

const scrollArrowClassName = cn(
    "sticky z-10 flex h-6 cursor-default items-center justify-center",
    "bg-elevated text-fg-subtle",
    "transition-opacity duration-100 ease-out",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
);

const SelectRoot = BaseSelect.Root;
(SelectRoot as { displayName?: string }).displayName = "Select";

export interface SelectLabelProps
    extends Omit<BaseSelectLabelProps, "className"> {
    className?: string;
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Label
            ref={ref}
            className={cn(
                "mb-1.5 block text-xs font-medium text-fg-muted",
                className
            )}
            {...props}
        />
    )
);
SelectLabel.displayName = "Select.Label";

export interface SelectTriggerProps
    extends Omit<BaseSelectTriggerProps, "className"> {
    size?: Size;
    invalid?: boolean;
    className?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ size = "md", invalid, className, ...props }, ref) => (
        <BaseSelect.Trigger
            ref={ref}
            data-invalid={invalid || undefined}
            className={cn(
                triggerBaseClassName,
                triggerSizeStyles[size],
                className
            )}
            {...props}
        />
    )
);
SelectTrigger.displayName = "Select.Trigger";

export interface SelectValueProps
    extends Omit<BaseSelectValueProps, "className"> {
    className?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Value
            ref={ref}
            className={cn(
                "min-w-0 flex-1 truncate text-left",
                "data-[placeholder]:text-fg-subtle",
                className
            )}
            {...props}
        />
    )
);
SelectValue.displayName = "Select.Value";

export interface SelectIconProps
    extends Omit<BaseSelectIconProps, "className"> {
    className?: string;
}

const SelectIcon = React.forwardRef<HTMLSpanElement, SelectIconProps>(
    ({ className, children, ...props }, ref) => (
        <BaseSelect.Icon
            ref={ref}
            className={cn(
                "ml-1 inline-flex shrink-0 items-center justify-center text-fg-subtle",
                className
            )}
            {...props}
        >
            {children ?? (
                <CaretUpDownIcon
                    className="size-3.5"
                    weight="bold"
                    aria-hidden
                />
            )}
        </BaseSelect.Icon>
    )
);
SelectIcon.displayName = "Select.Icon";

export interface SelectBackdropProps
    extends Omit<BaseSelectBackdropProps, "className"> {
    className?: string;
}

const SelectBackdrop = React.forwardRef<HTMLDivElement, SelectBackdropProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Backdrop
            ref={ref}
            className={cn(
                "fixed inset-0 z-40",
                "transition-opacity duration-150 ease-out",
                "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
                className
            )}
            {...props}
        />
    )
);
SelectBackdrop.displayName = "Select.Backdrop";

export interface SelectPortalProps extends BaseSelectPortalProps {}

const SelectPortal = BaseSelect.Portal as React.FC<SelectPortalProps>;
(SelectPortal as { displayName?: string }).displayName = "Select.Portal";

export interface SelectPositionerProps
    extends Omit<BaseSelectPositionerProps, "className"> {
    className?: string;
}

const SelectPositioner = React.forwardRef<
    HTMLDivElement,
    SelectPositionerProps
>(
    (
        {
            className,
            sideOffset = 6,
            alignItemWithTrigger = false,
            ...props
        },
        ref
    ) => (
        <BaseSelect.Positioner
            ref={ref}
            sideOffset={sideOffset}
            alignItemWithTrigger={alignItemWithTrigger}
            className={cn("z-50 outline-none", className)}
            {...props}
        />
    )
);
SelectPositioner.displayName = "Select.Positioner";

export interface SelectPopupProps
    extends Omit<BaseSelectPopupProps, "className"> {
    className?: string;
}

const SelectPopup = React.forwardRef<HTMLDivElement, SelectPopupProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Popup
            ref={ref}
            className={cn(popupBaseClassName, className)}
            {...props}
        />
    )
);
SelectPopup.displayName = "Select.Popup";

export interface SelectListProps
    extends Omit<BaseSelectListProps, "className"> {
    className?: string;
}

const SelectList = React.forwardRef<HTMLDivElement, SelectListProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.List
            ref={ref}
            className={cn("outline-none", className)}
            {...props}
        />
    )
);
SelectList.displayName = "Select.List";

export interface SelectArrowProps
    extends Omit<BaseSelectArrowProps, "className"> {
    className?: string;
}

const SelectArrow = React.forwardRef<HTMLDivElement, SelectArrowProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Arrow
            ref={ref}
            className={cn(
                "size-2 rotate-45 bg-elevated border border-line",
                className
            )}
            {...props}
        />
    )
);
SelectArrow.displayName = "Select.Arrow";

export interface SelectItemProps
    extends Omit<BaseSelectItemProps, "className"> {
    className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Item
            ref={ref}
            className={cn(itemBaseClassName, className)}
            {...props}
        />
    )
);
SelectItem.displayName = "Select.Item";

export interface SelectItemTextProps
    extends Omit<BaseSelectItemTextProps, "className"> {
    className?: string;
}

const SelectItemText = React.forwardRef<HTMLDivElement, SelectItemTextProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.ItemText
            ref={ref}
            className={cn("min-w-0 flex-1 truncate", className)}
            {...props}
        />
    )
);
SelectItemText.displayName = "Select.ItemText";

export interface SelectItemIndicatorProps
    extends Omit<BaseSelectItemIndicatorProps, "className"> {
    className?: string;
}

const SelectItemIndicator = React.forwardRef<
    HTMLSpanElement,
    SelectItemIndicatorProps
>(({ className, children, ...props }, ref) => (
    <BaseSelect.ItemIndicator
        ref={ref}
        className={cn(indicatorWrapperClassName, className)}
        {...props}
    >
        {children ?? (
            <CheckIcon className="size-3.5" weight="bold" aria-hidden />
        )}
    </BaseSelect.ItemIndicator>
));
SelectItemIndicator.displayName = "Select.ItemIndicator";

export interface SelectGroupProps extends BaseSelectGroupProps {}

const SelectGroup = BaseSelect.Group as React.FC<SelectGroupProps>;
(SelectGroup as { displayName?: string }).displayName = "Select.Group";

export interface SelectGroupLabelProps
    extends Omit<BaseSelectGroupLabelProps, "className"> {
    className?: string;
}

const SelectGroupLabel = React.forwardRef<HTMLDivElement, SelectGroupLabelProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.GroupLabel
            ref={ref}
            className={cn(
                "px-2 py-1 text-[11px] font-medium text-fg-subtle",
                className
            )}
            {...props}
        />
    )
);
SelectGroupLabel.displayName = "Select.GroupLabel";

export interface SelectScrollUpArrowProps
    extends Omit<BaseSelectScrollUpArrowProps, "className"> {
    className?: string;
}

const SelectScrollUpArrow = React.forwardRef<
    HTMLDivElement,
    SelectScrollUpArrowProps
>(({ className, children, ...props }, ref) => (
    <BaseSelect.ScrollUpArrow
        ref={ref}
        className={cn(scrollArrowClassName, "top-0 -mx-1 -mt-1", className)}
        {...props}
    >
        {children ?? (
            <CaretUpIcon className="size-3.5" weight="bold" aria-hidden />
        )}
    </BaseSelect.ScrollUpArrow>
));
SelectScrollUpArrow.displayName = "Select.ScrollUpArrow";

export interface SelectScrollDownArrowProps
    extends Omit<BaseSelectScrollDownArrowProps, "className"> {
    className?: string;
}

const SelectScrollDownArrow = React.forwardRef<
    HTMLDivElement,
    SelectScrollDownArrowProps
>(({ className, children, ...props }, ref) => (
    <BaseSelect.ScrollDownArrow
        ref={ref}
        className={cn(scrollArrowClassName, "bottom-0 -mx-1 -mb-1", className)}
        {...props}
    >
        {children ?? (
            <CaretDownIcon className="size-3.5" weight="bold" aria-hidden />
        )}
    </BaseSelect.ScrollDownArrow>
));
SelectScrollDownArrow.displayName = "Select.ScrollDownArrow";

export interface SelectSeparatorProps
    extends Omit<BaseSelectSeparatorProps, "className"> {
    className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Separator
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-line", className)}
            {...props}
        />
    )
);
SelectSeparator.displayName = "Select.Separator";

export const Select = Object.assign(SelectRoot, {
    Label: SelectLabel,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Icon: SelectIcon,
    Backdrop: SelectBackdrop,
    Portal: SelectPortal,
    Positioner: SelectPositioner,
    Popup: SelectPopup,
    List: SelectList,
    Arrow: SelectArrow,
    Item: SelectItem,
    ItemText: SelectItemText,
    ItemIndicator: SelectItemIndicator,
    Group: SelectGroup,
    GroupLabel: SelectGroupLabel,
    ScrollUpArrow: SelectScrollUpArrow,
    ScrollDownArrow: SelectScrollDownArrow,
    Separator: SelectSeparator
});
