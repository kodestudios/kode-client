import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import type { SelectRoot as BaseSelectRoot } from "@base-ui/react/select";
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

export type MultiSelectRootProps<Value> = Omit<
    BaseSelectRoot.Props<Value, true>,
    "multiple"
>;

function MultiSelectRoot<Value>(
    props: MultiSelectRootProps<Value>
): React.JSX.Element {
    return <BaseSelect.Root<Value, true> multiple {...props} />;
}

(MultiSelectRoot as { displayName?: string }).displayName = "MultiSelect";

export interface MultiSelectLabelProps
    extends Omit<BaseSelectLabelProps, "className"> {
    className?: string;
}

const MultiSelectLabel = React.forwardRef<HTMLDivElement, MultiSelectLabelProps>(
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
MultiSelectLabel.displayName = "MultiSelect.Label";

export interface MultiSelectTriggerProps
    extends Omit<BaseSelectTriggerProps, "className"> {
    size?: Size;
    invalid?: boolean;
    className?: string;
}

const MultiSelectTrigger = React.forwardRef<
    HTMLButtonElement,
    MultiSelectTriggerProps
>(({ size = "md", invalid, className, ...props }, ref) => (
    <BaseSelect.Trigger
        ref={ref}
        data-invalid={invalid || undefined}
        className={cn(triggerBaseClassName, triggerSizeStyles[size], className)}
        {...props}
    />
));
MultiSelectTrigger.displayName = "MultiSelect.Trigger";

export interface MultiSelectValueProps
    extends Omit<BaseSelectValueProps, "className"> {
    className?: string;
}

const MultiSelectValue = React.forwardRef<
    HTMLSpanElement,
    MultiSelectValueProps
>(({ className, ...props }, ref) => (
    <BaseSelect.Value
        ref={ref}
        className={cn(
            "min-w-0 flex-1 truncate text-left",
            "data-[placeholder]:text-fg-subtle",
            className
        )}
        {...props}
    />
));
MultiSelectValue.displayName = "MultiSelect.Value";

export interface MultiSelectIconProps
    extends Omit<BaseSelectIconProps, "className"> {
    className?: string;
}

const MultiSelectIcon = React.forwardRef<HTMLSpanElement, MultiSelectIconProps>(
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
MultiSelectIcon.displayName = "MultiSelect.Icon";

export interface MultiSelectBackdropProps
    extends Omit<BaseSelectBackdropProps, "className"> {
    className?: string;
}

const MultiSelectBackdrop = React.forwardRef<
    HTMLDivElement,
    MultiSelectBackdropProps
>(({ className, ...props }, ref) => (
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
));
MultiSelectBackdrop.displayName = "MultiSelect.Backdrop";

export interface MultiSelectPortalProps extends BaseSelectPortalProps {}

const MultiSelectPortal = BaseSelect.Portal as React.FC<MultiSelectPortalProps>;
(MultiSelectPortal as { displayName?: string }).displayName =
    "MultiSelect.Portal";

export interface MultiSelectPositionerProps
    extends Omit<BaseSelectPositionerProps, "className"> {
    className?: string;
}

const MultiSelectPositioner = React.forwardRef<
    HTMLDivElement,
    MultiSelectPositionerProps
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
MultiSelectPositioner.displayName = "MultiSelect.Positioner";

export interface MultiSelectPopupProps
    extends Omit<BaseSelectPopupProps, "className"> {
    className?: string;
}

const MultiSelectPopup = React.forwardRef<HTMLDivElement, MultiSelectPopupProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Popup
            ref={ref}
            className={cn(popupBaseClassName, className)}
            {...props}
        />
    )
);
MultiSelectPopup.displayName = "MultiSelect.Popup";

export interface MultiSelectListProps
    extends Omit<BaseSelectListProps, "className"> {
    className?: string;
}

const MultiSelectList = React.forwardRef<HTMLDivElement, MultiSelectListProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.List
            ref={ref}
            className={cn("outline-none", className)}
            {...props}
        />
    )
);
MultiSelectList.displayName = "MultiSelect.List";

export interface MultiSelectArrowProps
    extends Omit<BaseSelectArrowProps, "className"> {
    className?: string;
}

const MultiSelectArrow = React.forwardRef<HTMLDivElement, MultiSelectArrowProps>(
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
MultiSelectArrow.displayName = "MultiSelect.Arrow";

export interface MultiSelectItemProps
    extends Omit<BaseSelectItemProps, "className"> {
    className?: string;
}

const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
    ({ className, ...props }, ref) => (
        <BaseSelect.Item
            ref={ref}
            className={cn(itemBaseClassName, className)}
            {...props}
        />
    )
);
MultiSelectItem.displayName = "MultiSelect.Item";

export interface MultiSelectItemTextProps
    extends Omit<BaseSelectItemTextProps, "className"> {
    className?: string;
}

const MultiSelectItemText = React.forwardRef<
    HTMLDivElement,
    MultiSelectItemTextProps
>(({ className, ...props }, ref) => (
    <BaseSelect.ItemText
        ref={ref}
        className={cn("min-w-0 flex-1 truncate", className)}
        {...props}
    />
));
MultiSelectItemText.displayName = "MultiSelect.ItemText";

export interface MultiSelectItemIndicatorProps
    extends Omit<BaseSelectItemIndicatorProps, "className"> {
    className?: string;
}

const MultiSelectItemIndicator = React.forwardRef<
    HTMLSpanElement,
    MultiSelectItemIndicatorProps
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
MultiSelectItemIndicator.displayName = "MultiSelect.ItemIndicator";

export interface MultiSelectGroupProps extends BaseSelectGroupProps {}

const MultiSelectGroup = BaseSelect.Group as React.FC<MultiSelectGroupProps>;
(MultiSelectGroup as { displayName?: string }).displayName =
    "MultiSelect.Group";

export interface MultiSelectGroupLabelProps
    extends Omit<BaseSelectGroupLabelProps, "className"> {
    className?: string;
}

const MultiSelectGroupLabel = React.forwardRef<
    HTMLDivElement,
    MultiSelectGroupLabelProps
>(({ className, ...props }, ref) => (
    <BaseSelect.GroupLabel
        ref={ref}
        className={cn(
            "px-2 py-1 text-[11px] font-medium text-fg-subtle",
            className
        )}
        {...props}
    />
));
MultiSelectGroupLabel.displayName = "MultiSelect.GroupLabel";

export interface MultiSelectScrollUpArrowProps
    extends Omit<BaseSelectScrollUpArrowProps, "className"> {
    className?: string;
}

const MultiSelectScrollUpArrow = React.forwardRef<
    HTMLDivElement,
    MultiSelectScrollUpArrowProps
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
MultiSelectScrollUpArrow.displayName = "MultiSelect.ScrollUpArrow";

export interface MultiSelectScrollDownArrowProps
    extends Omit<BaseSelectScrollDownArrowProps, "className"> {
    className?: string;
}

const MultiSelectScrollDownArrow = React.forwardRef<
    HTMLDivElement,
    MultiSelectScrollDownArrowProps
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
MultiSelectScrollDownArrow.displayName = "MultiSelect.ScrollDownArrow";

export interface MultiSelectSeparatorProps
    extends Omit<BaseSelectSeparatorProps, "className"> {
    className?: string;
}

const MultiSelectSeparator = React.forwardRef<
    HTMLDivElement,
    MultiSelectSeparatorProps
>(({ className, ...props }, ref) => (
    <BaseSelect.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-line", className)}
        {...props}
    />
));
MultiSelectSeparator.displayName = "MultiSelect.Separator";

export const MultiSelect = Object.assign(MultiSelectRoot, {
    Label: MultiSelectLabel,
    Trigger: MultiSelectTrigger,
    Value: MultiSelectValue,
    Icon: MultiSelectIcon,
    Backdrop: MultiSelectBackdrop,
    Portal: MultiSelectPortal,
    Positioner: MultiSelectPositioner,
    Popup: MultiSelectPopup,
    List: MultiSelectList,
    Arrow: MultiSelectArrow,
    Item: MultiSelectItem,
    ItemText: MultiSelectItemText,
    ItemIndicator: MultiSelectItemIndicator,
    Group: MultiSelectGroup,
    GroupLabel: MultiSelectGroupLabel,
    ScrollUpArrow: MultiSelectScrollUpArrow,
    ScrollDownArrow: MultiSelectScrollDownArrow,
    Separator: MultiSelectSeparator
});
