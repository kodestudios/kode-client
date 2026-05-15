import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { CaretRightIcon, CheckIcon, CircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type BaseContextMenuRootProps = React.ComponentProps<
    typeof BaseContextMenu.Root
>;
type BaseContextMenuTriggerProps = React.ComponentProps<
    typeof BaseContextMenu.Trigger
>;
type BaseContextMenuPortalProps = React.ComponentProps<
    typeof BaseContextMenu.Portal
>;
type BaseContextMenuPositionerProps = React.ComponentProps<
    typeof BaseContextMenu.Positioner
>;
type BaseContextMenuPopupProps = React.ComponentProps<
    typeof BaseContextMenu.Popup
>;
type BaseContextMenuItemProps = React.ComponentProps<
    typeof BaseContextMenu.Item
>;
type BaseContextMenuLinkItemProps = React.ComponentProps<
    typeof BaseContextMenu.LinkItem
>;
type BaseContextMenuSeparatorProps = React.ComponentProps<
    typeof BaseContextMenu.Separator
>;
type BaseContextMenuGroupProps = React.ComponentProps<
    typeof BaseContextMenu.Group
>;
type BaseContextMenuGroupLabelProps = React.ComponentProps<
    typeof BaseContextMenu.GroupLabel
>;
type BaseContextMenuRadioGroupProps = React.ComponentProps<
    typeof BaseContextMenu.RadioGroup
>;
type BaseContextMenuRadioItemProps = React.ComponentProps<
    typeof BaseContextMenu.RadioItem
>;
type BaseContextMenuCheckboxItemProps = React.ComponentProps<
    typeof BaseContextMenu.CheckboxItem
>;
type BaseContextMenuSubmenuRootProps = React.ComponentProps<
    typeof BaseContextMenu.SubmenuRoot
>;
type BaseContextMenuSubmenuTriggerProps = React.ComponentProps<
    typeof BaseContextMenu.SubmenuTrigger
>;

const popupBaseClassName = cn(
    "min-w-[10rem] outline-none",
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
    "rounded-xs px-2.5 py-1.5 text-xs text-fg outline-none",
    "transition-colors duration-100 ease-out",
    "data-[highlighted]:bg-panel",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const indicatorItemClassName = cn(
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-xs py-1.5 pr-2.5 pl-7 text-xs text-fg outline-none",
    "transition-colors duration-100 ease-out",
    "data-[highlighted]:bg-panel",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const indicatorWrapperClassName = cn(
    "absolute left-1.5 inline-flex size-4 shrink-0 items-center justify-center text-fg",
    "data-[unchecked]:hidden",
    "transition-opacity duration-100 ease-out",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
);

const ContextMenuSubmenuContext = React.createContext(false);

export interface ContextMenuProps extends BaseContextMenuRootProps {}

const ContextMenuRoot = BaseContextMenu.Root as React.FC<ContextMenuProps>;
(ContextMenuRoot as { displayName?: string }).displayName = "ContextMenu";

export interface ContextMenuTriggerProps
    extends Omit<BaseContextMenuTriggerProps, "className"> {
    className?: string;
}

const ContextMenuTrigger = React.forwardRef<
    HTMLDivElement,
    ContextMenuTriggerProps
>(({ className, ...props }, ref) => (
    <BaseContextMenu.Trigger
        ref={ref}
        className={cn("outline-none", className)}
        {...props}
    />
));
ContextMenuTrigger.displayName = "ContextMenu.Trigger";

export interface ContextMenuPortalProps extends BaseContextMenuPortalProps {}

const ContextMenuPortal =
    BaseContextMenu.Portal as React.FC<ContextMenuPortalProps>;
(ContextMenuPortal as { displayName?: string }).displayName =
    "ContextMenu.Portal";

export interface ContextMenuPositionerProps
    extends Omit<BaseContextMenuPositionerProps, "className"> {
    className?: string;
}

const ContextMenuPositioner = React.forwardRef<
    HTMLDivElement,
    ContextMenuPositionerProps
>(({ className, sideOffset, ...props }, ref) => {
    const isSubmenu = React.useContext(ContextMenuSubmenuContext);
    return (
        <BaseContextMenu.Positioner
            ref={ref}
            sideOffset={sideOffset ?? (isSubmenu ? 6 : undefined)}
            className={cn("z-50 outline-none", className)}
            {...props}
        />
    );
});
ContextMenuPositioner.displayName = "ContextMenu.Positioner";

export interface ContextMenuPopupProps
    extends Omit<BaseContextMenuPopupProps, "className"> {
    className?: string;
}

const ContextMenuPopup = React.forwardRef<HTMLDivElement, ContextMenuPopupProps>(
    ({ className, ...props }, ref) => (
        <BaseContextMenu.Popup
            ref={ref}
            className={cn(popupBaseClassName, className)}
            {...props}
        />
    )
);
ContextMenuPopup.displayName = "ContextMenu.Popup";

export interface ContextMenuContentProps
    extends Omit<BaseContextMenuPopupProps, "className" | "children"> {
    children?: React.ReactNode;
    side?: BaseContextMenuPositionerProps["side"];
    align?: BaseContextMenuPositionerProps["align"];
    sideOffset?: BaseContextMenuPositionerProps["sideOffset"];
    alignOffset?: BaseContextMenuPositionerProps["alignOffset"];
    collisionPadding?: BaseContextMenuPositionerProps["collisionPadding"];
    container?: BaseContextMenuPortalProps["container"];
    keepMounted?: BaseContextMenuPortalProps["keepMounted"];
    className?: string;
    positionerClassName?: string;
}

const ContextMenuContent = React.forwardRef<
    HTMLDivElement,
    ContextMenuContentProps
>(
    (
        {
            children,
            side,
            align,
            sideOffset,
            alignOffset,
            collisionPadding,
            container,
            keepMounted,
            className,
            positionerClassName,
            ...popupProps
        },
        ref
    ) => {
        const isSubmenu = React.useContext(ContextMenuSubmenuContext);
        return (
            <BaseContextMenu.Portal
                container={container}
                keepMounted={keepMounted}
            >
                <BaseContextMenu.Positioner
                    side={side}
                    align={align}
                    sideOffset={sideOffset ?? (isSubmenu ? 6 : undefined)}
                    alignOffset={alignOffset}
                    collisionPadding={collisionPadding}
                    className={cn(
                        "z-50 outline-none",
                        positionerClassName
                    )}
                >
                    <BaseContextMenu.Popup
                        ref={ref}
                        className={cn(popupBaseClassName, className)}
                        {...popupProps}
                    >
                        {children}
                    </BaseContextMenu.Popup>
                </BaseContextMenu.Positioner>
            </BaseContextMenu.Portal>
        );
    }
);
ContextMenuContent.displayName = "ContextMenu.Content";

export interface ContextMenuItemProps
    extends Omit<BaseContextMenuItemProps, "className"> {
    inset?: boolean;
    className?: string;
}

const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
    ({ inset, className, ...props }, ref) => (
        <BaseContextMenu.Item
            ref={ref}
            className={cn(itemBaseClassName, inset && "pl-7", className)}
            {...props}
        />
    )
);
ContextMenuItem.displayName = "ContextMenu.Item";

export interface ContextMenuLinkItemProps
    extends Omit<BaseContextMenuLinkItemProps, "className"> {
    inset?: boolean;
    className?: string;
}

const ContextMenuLinkItem = React.forwardRef<
    HTMLAnchorElement,
    ContextMenuLinkItemProps
>(({ inset, className, ...props }, ref) => (
    <BaseContextMenu.LinkItem
        ref={ref}
        className={cn(
            itemBaseClassName,
            "no-underline",
            inset && "pl-7",
            className
        )}
        {...props}
    />
));
ContextMenuLinkItem.displayName = "ContextMenu.LinkItem";

export interface ContextMenuSeparatorProps
    extends Omit<BaseContextMenuSeparatorProps, "className"> {
    className?: string;
}

const ContextMenuSeparator = React.forwardRef<
    HTMLDivElement,
    ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
    <BaseContextMenu.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-line", className)}
        {...props}
    />
));
ContextMenuSeparator.displayName = "ContextMenu.Separator";

export interface ContextMenuGroupProps extends BaseContextMenuGroupProps {}

const ContextMenuGroup =
    BaseContextMenu.Group as React.FC<ContextMenuGroupProps>;
(ContextMenuGroup as { displayName?: string }).displayName =
    "ContextMenu.Group";

export interface ContextMenuGroupLabelProps
    extends Omit<BaseContextMenuGroupLabelProps, "className"> {
    className?: string;
}

const ContextMenuGroupLabel = React.forwardRef<
    HTMLDivElement,
    ContextMenuGroupLabelProps
>(({ className, ...props }, ref) => (
    <BaseContextMenu.GroupLabel
        ref={ref}
        className={cn(
            "px-2 py-1 text-[11px] font-medium text-fg-subtle",
            className
        )}
        {...props}
    />
));
ContextMenuGroupLabel.displayName = "ContextMenu.GroupLabel";

export interface ContextMenuRadioGroupProps
    extends BaseContextMenuRadioGroupProps {}

const ContextMenuRadioGroup =
    BaseContextMenu.RadioGroup as React.FC<ContextMenuRadioGroupProps>;
(ContextMenuRadioGroup as { displayName?: string }).displayName =
    "ContextMenu.RadioGroup";

export interface ContextMenuRadioItemProps
    extends Omit<BaseContextMenuRadioItemProps, "className"> {
    className?: string;
    indicatorClassName?: string;
}

const ContextMenuRadioItem = React.forwardRef<
    HTMLDivElement,
    ContextMenuRadioItemProps
>(({ className, indicatorClassName, children, ...props }, ref) => (
    <BaseContextMenu.RadioItem
        ref={ref}
        className={cn(indicatorItemClassName, className)}
        {...props}
    >
        <BaseContextMenu.RadioItemIndicator
            className={cn(indicatorWrapperClassName, indicatorClassName)}
        >
            <CircleIcon className="size-2" weight="fill" aria-hidden />
        </BaseContextMenu.RadioItemIndicator>
        {children}
    </BaseContextMenu.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenu.RadioItem";

export interface ContextMenuCheckboxItemProps
    extends Omit<BaseContextMenuCheckboxItemProps, "className"> {
    className?: string;
    indicatorClassName?: string;
}

const ContextMenuCheckboxItem = React.forwardRef<
    HTMLDivElement,
    ContextMenuCheckboxItemProps
>(({ className, indicatorClassName, children, ...props }, ref) => (
    <BaseContextMenu.CheckboxItem
        ref={ref}
        className={cn(indicatorItemClassName, className)}
        {...props}
    >
        <BaseContextMenu.CheckboxItemIndicator
            className={cn(indicatorWrapperClassName, indicatorClassName)}
        >
            <CheckIcon className="size-3.5" weight="bold" aria-hidden />
        </BaseContextMenu.CheckboxItemIndicator>
        {children}
    </BaseContextMenu.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenu.CheckboxItem";

export interface ContextMenuSubmenuRootProps
    extends BaseContextMenuSubmenuRootProps {}

const ContextMenuSubmenuRoot: React.FC<ContextMenuSubmenuRootProps> = (
    props
) => (
    <ContextMenuSubmenuContext.Provider value={true}>
        <BaseContextMenu.SubmenuRoot {...props} />
    </ContextMenuSubmenuContext.Provider>
);
ContextMenuSubmenuRoot.displayName = "ContextMenu.SubmenuRoot";

export interface ContextMenuSubmenuTriggerProps
    extends Omit<BaseContextMenuSubmenuTriggerProps, "className"> {
    inset?: boolean;
    className?: string;
}

const ContextMenuSubmenuTrigger = React.forwardRef<
    HTMLDivElement,
    ContextMenuSubmenuTriggerProps
>(({ inset, className, children, ...props }, ref) => (
    <BaseContextMenu.SubmenuTrigger
        ref={ref}
        className={cn(
            itemBaseClassName,
            "data-[popup-open]:bg-panel",
            inset && "pl-7",
            className
        )}
        {...props}
    >
        {children}
        <CaretRightIcon
            className="ml-auto size-3.5 shrink-0 text-fg-subtle"
            aria-hidden
        />
    </BaseContextMenu.SubmenuTrigger>
));
ContextMenuSubmenuTrigger.displayName = "ContextMenu.SubmenuTrigger";

export const ContextMenu = Object.assign(ContextMenuRoot, {
    Trigger: ContextMenuTrigger,
    Portal: ContextMenuPortal,
    Positioner: ContextMenuPositioner,
    Popup: ContextMenuPopup,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    LinkItem: ContextMenuLinkItem,
    Separator: ContextMenuSeparator,
    Group: ContextMenuGroup,
    GroupLabel: ContextMenuGroupLabel,
    RadioGroup: ContextMenuRadioGroup,
    RadioItem: ContextMenuRadioItem,
    CheckboxItem: ContextMenuCheckboxItem,
    SubmenuRoot: ContextMenuSubmenuRoot,
    SubmenuTrigger: ContextMenuSubmenuTrigger
});
