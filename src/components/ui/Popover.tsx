import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@/lib/cn";

type BasePopoverRootProps = React.ComponentProps<typeof BasePopover.Root>;
type BasePopoverTriggerProps = React.ComponentProps<typeof BasePopover.Trigger>;
type BasePopoverPortalProps = React.ComponentProps<typeof BasePopover.Portal>;
type BasePopoverBackdropProps = React.ComponentProps<
    typeof BasePopover.Backdrop
>;
type BasePopoverPositionerProps = React.ComponentProps<
    typeof BasePopover.Positioner
>;
type BasePopoverPopupProps = React.ComponentProps<typeof BasePopover.Popup>;
type BasePopoverTitleProps = React.ComponentProps<typeof BasePopover.Title>;
type BasePopoverDescriptionProps = React.ComponentProps<
    typeof BasePopover.Description
>;
type BasePopoverCloseProps = React.ComponentProps<typeof BasePopover.Close>;
type BasePopoverViewportProps = React.ComponentProps<
    typeof BasePopover.Viewport
>;

const popupBaseClassName = cn(
    "min-w-[12rem] outline-none",
    "bg-dark-850 text-dark-50 border border-dark-600",
    "rounded-xs shadow-lg shadow-black/40",
    "p-3",
    "[transform-origin:var(--transform-origin)]",
    "transition-[opacity,transform,scale] duration-150 ease-out",
    "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
    "data-[ending-style]:opacity-0 data-[ending-style]:scale-95"
);

const backdropBaseClassName = cn(
    "fixed inset-0 z-40 bg-black/40",
    "transition-opacity duration-150 ease-out",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
);

export interface PopoverProps extends BasePopoverRootProps {}

const PopoverRoot = BasePopover.Root as React.FC<PopoverProps>;
(PopoverRoot as { displayName?: string }).displayName = "Popover";

export interface PopoverTriggerProps extends BasePopoverTriggerProps {}

const PopoverTrigger = BasePopover.Trigger as React.FC<PopoverTriggerProps>;
(PopoverTrigger as { displayName?: string }).displayName = "Popover.Trigger";

export interface PopoverPortalProps extends BasePopoverPortalProps {}

const PopoverPortal = BasePopover.Portal as React.FC<PopoverPortalProps>;
(PopoverPortal as { displayName?: string }).displayName = "Popover.Portal";

export interface PopoverBackdropProps
    extends Omit<BasePopoverBackdropProps, "className"> {
    className?: string;
}

const PopoverBackdrop = React.forwardRef<HTMLDivElement, PopoverBackdropProps>(
    ({ className, ...props }, ref) => (
        <BasePopover.Backdrop
            ref={ref}
            className={cn(backdropBaseClassName, className)}
            {...props}
        />
    )
);
PopoverBackdrop.displayName = "Popover.Backdrop";

export interface PopoverPositionerProps
    extends Omit<BasePopoverPositionerProps, "className"> {
    className?: string;
}

const PopoverPositioner = React.forwardRef<
    HTMLDivElement,
    PopoverPositionerProps
>(({ className, sideOffset = 8, ...props }, ref) => (
    <BasePopover.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cn("z-50 outline-none", className)}
        {...props}
    />
));
PopoverPositioner.displayName = "Popover.Positioner";

export interface PopoverPopupProps
    extends Omit<BasePopoverPopupProps, "className"> {
    className?: string;
}

const PopoverPopup = React.forwardRef<HTMLDivElement, PopoverPopupProps>(
    ({ className, ...props }, ref) => (
        <BasePopover.Popup
            ref={ref}
            className={cn(popupBaseClassName, className)}
            {...props}
        />
    )
);
PopoverPopup.displayName = "Popover.Popup";

export interface PopoverContentProps
    extends Omit<BasePopoverPopupProps, "className" | "children"> {
    children?: React.ReactNode;
    side?: BasePopoverPositionerProps["side"];
    align?: BasePopoverPositionerProps["align"];
    sideOffset?: BasePopoverPositionerProps["sideOffset"];
    alignOffset?: BasePopoverPositionerProps["alignOffset"];
    collisionPadding?: BasePopoverPositionerProps["collisionPadding"];
    container?: BasePopoverPortalProps["container"];
    keepMounted?: BasePopoverPortalProps["keepMounted"];
    className?: string;
    positionerClassName?: string;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    (
        {
            children,
            side,
            align,
            sideOffset = 8,
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
        <BasePopover.Portal container={container} keepMounted={keepMounted}>
            <BasePopover.Positioner
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                collisionPadding={collisionPadding}
                className={cn("z-50 outline-none", positionerClassName)}
            >
                <BasePopover.Popup
                    ref={ref}
                    className={cn(popupBaseClassName, className)}
                    {...popupProps}
                >
                    {children}
                </BasePopover.Popup>
            </BasePopover.Positioner>
        </BasePopover.Portal>
    )
);
PopoverContent.displayName = "Popover.Content";

export interface PopoverTitleProps
    extends Omit<BasePopoverTitleProps, "className"> {
    className?: string;
}

const PopoverTitle = React.forwardRef<HTMLHeadingElement, PopoverTitleProps>(
    ({ className, ...props }, ref) => (
        <BasePopover.Title
            ref={ref}
            className={cn("m-0 text-sm font-medium text-dark-50", className)}
            {...props}
        />
    )
);
PopoverTitle.displayName = "Popover.Title";

export interface PopoverDescriptionProps
    extends Omit<BasePopoverDescriptionProps, "className"> {
    className?: string;
}

const PopoverDescription = React.forwardRef<
    HTMLParagraphElement,
    PopoverDescriptionProps
>(({ className, ...props }, ref) => (
    <BasePopover.Description
        ref={ref}
        className={cn("mt-1 mb-0 text-xs text-dark-200", className)}
        {...props}
    />
));
PopoverDescription.displayName = "Popover.Description";

export interface PopoverCloseProps
    extends Omit<BasePopoverCloseProps, "className"> {
    className?: string;
}

const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
    ({ className, ...props }, ref) => (
        <BasePopover.Close
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-xs px-2 py-1 text-xs text-dark-50 outline-none",
                "transition-colors duration-100 ease-out",
                "hover:bg-dark-700 focus-visible:bg-dark-700",
                className
            )}
            {...props}
        />
    )
);
PopoverClose.displayName = "Popover.Close";

export interface PopoverViewportProps
    extends Omit<BasePopoverViewportProps, "className"> {
    className?: string;
}

const PopoverViewport = React.forwardRef<HTMLDivElement, PopoverViewportProps>(
    ({ className, ...props }, ref) => (
        <BasePopover.Viewport
            ref={ref}
            className={cn("relative outline-none", className)}
            {...props}
        />
    )
);
PopoverViewport.displayName = "Popover.Viewport";

export const Popover = Object.assign(PopoverRoot, {
    Trigger: PopoverTrigger,
    Portal: PopoverPortal,
    Backdrop: PopoverBackdrop,
    Positioner: PopoverPositioner,
    Popup: PopoverPopup,
    Content: PopoverContent,
    Title: PopoverTitle,
    Description: PopoverDescription,
    Close: PopoverClose,
    Viewport: PopoverViewport,
    createHandle: BasePopover.createHandle
});
