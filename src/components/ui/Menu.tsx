import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CaretRightIcon, CheckIcon, CircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type BaseMenuRootProps = React.ComponentProps<typeof BaseMenu.Root>;
type BaseMenuTriggerProps = React.ComponentProps<typeof BaseMenu.Trigger>;
type BaseMenuPortalProps = React.ComponentProps<typeof BaseMenu.Portal>;
type BaseMenuPositionerProps = React.ComponentProps<typeof BaseMenu.Positioner>;
type BaseMenuPopupProps = React.ComponentProps<typeof BaseMenu.Popup>;
type BaseMenuItemProps = React.ComponentProps<typeof BaseMenu.Item>;
type BaseMenuLinkItemProps = React.ComponentProps<typeof BaseMenu.LinkItem>;
type BaseMenuSeparatorProps = React.ComponentProps<typeof BaseMenu.Separator>;
type BaseMenuGroupProps = React.ComponentProps<typeof BaseMenu.Group>;
type BaseMenuGroupLabelProps = React.ComponentProps<typeof BaseMenu.GroupLabel>;
type BaseMenuRadioGroupProps = React.ComponentProps<typeof BaseMenu.RadioGroup>;
type BaseMenuRadioItemProps = React.ComponentProps<typeof BaseMenu.RadioItem>;
type BaseMenuCheckboxItemProps = React.ComponentProps<
    typeof BaseMenu.CheckboxItem
>;
type BaseMenuSubmenuRootProps = React.ComponentProps<
    typeof BaseMenu.SubmenuRoot
>;
type BaseMenuSubmenuTriggerProps = React.ComponentProps<
    typeof BaseMenu.SubmenuTrigger
>;

const popupBaseClassName = cn(
    "min-w-[10rem] outline-none",
    "bg-dark-850 text-dark-50 border border-dark-600",
    "rounded-xs shadow-lg shadow-black/40",
    "p-1",
    "[transform-origin:var(--transform-origin)]",
    "transition-[opacity,transform,scale] duration-150 ease-out",
    "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
    "data-[ending-style]:opacity-0 data-[ending-style]:scale-95"
);

const itemBaseClassName = cn(
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-xs px-2.5 py-1.5 text-xs text-dark-50 outline-none",
    "transition-colors duration-100 ease-out",
    "data-[highlighted]:bg-dark-700",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const indicatorItemClassName = cn(
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-xs py-1.5 pr-2.5 pl-7 text-xs text-dark-50 outline-none",
    "transition-colors duration-100 ease-out",
    "data-[highlighted]:bg-dark-700",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const indicatorWrapperClassName = cn(
    "absolute left-1.5 inline-flex size-4 shrink-0 items-center justify-center text-dark-50",
    "data-[unchecked]:hidden",
    "transition-opacity duration-100 ease-out",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
);

export interface MenuProps extends BaseMenuRootProps {}

const MenuRoot = BaseMenu.Root as React.FC<MenuProps>;
(MenuRoot as { displayName?: string }).displayName = "Menu";

export interface MenuTriggerProps extends BaseMenuTriggerProps {}

const MenuTrigger = BaseMenu.Trigger as React.FC<MenuTriggerProps>;
(MenuTrigger as { displayName?: string }).displayName = "Menu.Trigger";

export interface MenuPortalProps extends BaseMenuPortalProps {}

const MenuPortal = BaseMenu.Portal as React.FC<MenuPortalProps>;
(MenuPortal as { displayName?: string }).displayName = "Menu.Portal";

export interface MenuPositionerProps
    extends Omit<BaseMenuPositionerProps, "className"> {
    className?: string;
}

const MenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
    ({ className, sideOffset = 6, ...props }, ref) => (
        <BaseMenu.Positioner
            ref={ref}
            sideOffset={sideOffset}
            className={cn("z-50 outline-none", className)}
            {...props}
        />
    )
);
MenuPositioner.displayName = "Menu.Positioner";

export interface MenuPopupProps extends Omit<BaseMenuPopupProps, "className"> {
    className?: string;
}

const MenuPopup = React.forwardRef<HTMLDivElement, MenuPopupProps>(
    ({ className, ...props }, ref) => (
        <BaseMenu.Popup
            ref={ref}
            className={cn(popupBaseClassName, className)}
            {...props}
        />
    )
);
MenuPopup.displayName = "Menu.Popup";

export interface MenuContentProps
    extends Omit<BaseMenuPopupProps, "className" | "children"> {
    children?: React.ReactNode;
    side?: BaseMenuPositionerProps["side"];
    align?: BaseMenuPositionerProps["align"];
    sideOffset?: BaseMenuPositionerProps["sideOffset"];
    alignOffset?: BaseMenuPositionerProps["alignOffset"];
    collisionPadding?: BaseMenuPositionerProps["collisionPadding"];
    container?: BaseMenuPortalProps["container"];
    keepMounted?: BaseMenuPortalProps["keepMounted"];
    className?: string;
    positionerClassName?: string;
}

const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
    (
        {
            children,
            side,
            align,
            sideOffset = 6,
            alignOffset,
            collisionPadding,
            container,
            keepMounted,
            className,
            positionerClassName,
            ...popupProps
        },
        ref
    ) => (
        <BaseMenu.Portal container={container} keepMounted={keepMounted}>
            <BaseMenu.Positioner
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                collisionPadding={collisionPadding}
                className={cn("z-50 outline-none", positionerClassName)}
            >
                <BaseMenu.Popup
                    ref={ref}
                    className={cn(popupBaseClassName, className)}
                    {...popupProps}
                >
                    {children}
                </BaseMenu.Popup>
            </BaseMenu.Positioner>
        </BaseMenu.Portal>
    )
);
MenuContent.displayName = "Menu.Content";

export interface MenuItemProps extends Omit<BaseMenuItemProps, "className"> {
    inset?: boolean;
    className?: string;
}

const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
    ({ inset, className, ...props }, ref) => (
        <BaseMenu.Item
            ref={ref}
            className={cn(itemBaseClassName, inset && "pl-7", className)}
            {...props}
        />
    )
);
MenuItem.displayName = "Menu.Item";

export interface MenuLinkItemProps
    extends Omit<BaseMenuLinkItemProps, "className"> {
    inset?: boolean;
    className?: string;
}

const MenuLinkItem = React.forwardRef<HTMLAnchorElement, MenuLinkItemProps>(
    ({ inset, className, ...props }, ref) => (
        <BaseMenu.LinkItem
            ref={ref}
            className={cn(
                itemBaseClassName,
                "no-underline",
                inset && "pl-7",
                className
            )}
            {...props}
        />
    )
);
MenuLinkItem.displayName = "Menu.LinkItem";

export interface MenuSeparatorProps
    extends Omit<BaseMenuSeparatorProps, "className"> {
    className?: string;
}

const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
    ({ className, ...props }, ref) => (
        <BaseMenu.Separator
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-dark-600", className)}
            {...props}
        />
    )
);
MenuSeparator.displayName = "Menu.Separator";

export interface MenuGroupProps extends BaseMenuGroupProps {}

const MenuGroup = BaseMenu.Group as React.FC<MenuGroupProps>;
(MenuGroup as { displayName?: string }).displayName = "Menu.Group";

export interface MenuGroupLabelProps
    extends Omit<BaseMenuGroupLabelProps, "className"> {
    className?: string;
}

const MenuGroupLabel = React.forwardRef<HTMLDivElement, MenuGroupLabelProps>(
    ({ className, ...props }, ref) => (
        <BaseMenu.GroupLabel
            ref={ref}
            className={cn(
                "px-2 py-1 text-[11px] font-medium text-dark-200",
                className
            )}
            {...props}
        />
    )
);
MenuGroupLabel.displayName = "Menu.GroupLabel";

export interface MenuRadioGroupProps extends BaseMenuRadioGroupProps {}

const MenuRadioGroup = BaseMenu.RadioGroup as React.FC<MenuRadioGroupProps>;
(MenuRadioGroup as { displayName?: string }).displayName = "Menu.RadioGroup";

export interface MenuRadioItemProps
    extends Omit<BaseMenuRadioItemProps, "className"> {
    className?: string;
    indicatorClassName?: string;
}

const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>(
    ({ className, indicatorClassName, children, ...props }, ref) => (
        <BaseMenu.RadioItem
            ref={ref}
            className={cn(indicatorItemClassName, className)}
            {...props}
        >
            <BaseMenu.RadioItemIndicator
                className={cn(indicatorWrapperClassName, indicatorClassName)}
            >
                <CircleIcon className="size-2" weight="fill" aria-hidden />
            </BaseMenu.RadioItemIndicator>
            {children}
        </BaseMenu.RadioItem>
    )
);
MenuRadioItem.displayName = "Menu.RadioItem";

export interface MenuCheckboxItemProps
    extends Omit<BaseMenuCheckboxItemProps, "className"> {
    className?: string;
    indicatorClassName?: string;
}

const MenuCheckboxItem = React.forwardRef<
    HTMLDivElement,
    MenuCheckboxItemProps
>(({ className, indicatorClassName, children, ...props }, ref) => (
    <BaseMenu.CheckboxItem
        ref={ref}
        className={cn(indicatorItemClassName, className)}
        {...props}
    >
        <BaseMenu.CheckboxItemIndicator
            className={cn(indicatorWrapperClassName, indicatorClassName)}
        >
            <CheckIcon className="size-3.5" weight="bold" aria-hidden />
        </BaseMenu.CheckboxItemIndicator>
        {children}
    </BaseMenu.CheckboxItem>
));
MenuCheckboxItem.displayName = "Menu.CheckboxItem";

export interface MenuSubmenuRootProps extends BaseMenuSubmenuRootProps {}

const MenuSubmenuRoot = BaseMenu.SubmenuRoot as React.FC<MenuSubmenuRootProps>;
(MenuSubmenuRoot as { displayName?: string }).displayName = "Menu.SubmenuRoot";

export interface MenuSubmenuTriggerProps
    extends Omit<BaseMenuSubmenuTriggerProps, "className"> {
    inset?: boolean;
    className?: string;
}

const MenuSubmenuTrigger = React.forwardRef<
    HTMLDivElement,
    MenuSubmenuTriggerProps
>(({ inset, className, children, ...props }, ref) => (
    <BaseMenu.SubmenuTrigger
        ref={ref}
        className={cn(
            itemBaseClassName,
            "data-[popup-open]:bg-dark-700",
            inset && "pl-7",
            className
        )}
        {...props}
    >
        {children}
        <CaretRightIcon
            className="ml-auto size-3.5 shrink-0 text-dark-200"
            aria-hidden
        />
    </BaseMenu.SubmenuTrigger>
));
MenuSubmenuTrigger.displayName = "Menu.SubmenuTrigger";

export const Menu = Object.assign(MenuRoot, {
    Trigger: MenuTrigger,
    Portal: MenuPortal,
    Positioner: MenuPositioner,
    Popup: MenuPopup,
    Content: MenuContent,
    Item: MenuItem,
    LinkItem: MenuLinkItem,
    Separator: MenuSeparator,
    Group: MenuGroup,
    GroupLabel: MenuGroupLabel,
    RadioGroup: MenuRadioGroup,
    RadioItem: MenuRadioItem,
    CheckboxItem: MenuCheckboxItem,
    SubmenuRoot: MenuSubmenuRoot,
    SubmenuTrigger: MenuSubmenuTrigger,
    createHandle: BaseMenu.createHandle
});
