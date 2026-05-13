import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/cn";

type BaseTooltipProviderProps = React.ComponentProps<
    typeof BaseTooltip.Provider
>;
type BaseTooltipRootProps = React.ComponentProps<typeof BaseTooltip.Root>;
type BaseTooltipTriggerProps = React.ComponentProps<typeof BaseTooltip.Trigger>;
type BaseTooltipPortalProps = React.ComponentProps<typeof BaseTooltip.Portal>;
type BaseTooltipPositionerProps = React.ComponentProps<
    typeof BaseTooltip.Positioner
>;
type BaseTooltipPopupProps = React.ComponentProps<typeof BaseTooltip.Popup>;
type BaseTooltipViewportProps = React.ComponentProps<
    typeof BaseTooltip.Viewport
>;

const popupBaseClassName = cn(
    "max-w-xs outline-none",
    "bg-dark-700 text-dark-50",
    "border border-dark-500/40",
    "rounded-xs shadow-md shadow-black/40",
    "px-2 py-1 text-xs font-medium leading-snug",
    "[transform-origin:var(--transform-origin)]",
    "transition-[opacity,transform,scale] duration-150 ease-out",
    "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
    "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
    "data-[instant]:transition-none"
);

export interface TooltipProviderProps extends BaseTooltipProviderProps {}

const TooltipProvider: React.FC<TooltipProviderProps> = ({
    delay = 150,
    closeDelay = 0,
    ...props
}) => <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} {...props} />;
TooltipProvider.displayName = "Tooltip.Provider";

export interface TooltipProps extends BaseTooltipRootProps {}

const TooltipRoot = BaseTooltip.Root as React.FC<TooltipProps>;
(TooltipRoot as { displayName?: string }).displayName = "Tooltip";

export interface TooltipTriggerProps extends BaseTooltipTriggerProps {}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
    delay = 150,
    closeDelay = 0,
    ...props
}) => <BaseTooltip.Trigger delay={delay} closeDelay={closeDelay} {...props} />;
TooltipTrigger.displayName = "Tooltip.Trigger";

export interface TooltipPortalProps extends BaseTooltipPortalProps {}

const TooltipPortal = BaseTooltip.Portal as React.FC<TooltipPortalProps>;
(TooltipPortal as { displayName?: string }).displayName = "Tooltip.Portal";

export interface TooltipPositionerProps
    extends Omit<BaseTooltipPositionerProps, "className"> {
    className?: string;
}

const TooltipPositioner = React.forwardRef<
    HTMLDivElement,
    TooltipPositionerProps
>(({ className, sideOffset = 6, ...props }, ref) => (
    <BaseTooltip.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cn("z-50 outline-none", className)}
        {...props}
    />
));
TooltipPositioner.displayName = "Tooltip.Positioner";

export interface TooltipPopupProps
    extends Omit<BaseTooltipPopupProps, "className"> {
    className?: string;
}

const TooltipPopup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(
    ({ className, ...props }, ref) => (
        <BaseTooltip.Popup
            ref={ref}
            className={cn(popupBaseClassName, className)}
            {...props}
        />
    )
);
TooltipPopup.displayName = "Tooltip.Popup";

export interface TooltipViewportProps
    extends Omit<BaseTooltipViewportProps, "className"> {
    className?: string;
}

const TooltipViewport = React.forwardRef<HTMLDivElement, TooltipViewportProps>(
    ({ className, ...props }, ref) => (
        <BaseTooltip.Viewport
            ref={ref}
            className={cn("relative outline-none", className)}
            {...props}
        />
    )
);
TooltipViewport.displayName = "Tooltip.Viewport";

export interface TooltipContentProps
    extends Omit<BaseTooltipPopupProps, "className" | "children"> {
    children?: React.ReactNode;
    side?: BaseTooltipPositionerProps["side"];
    align?: BaseTooltipPositionerProps["align"];
    sideOffset?: BaseTooltipPositionerProps["sideOffset"];
    alignOffset?: BaseTooltipPositionerProps["alignOffset"];
    collisionPadding?: BaseTooltipPositionerProps["collisionPadding"];
    container?: BaseTooltipPortalProps["container"];
    keepMounted?: BaseTooltipPortalProps["keepMounted"];
    className?: string;
    positionerClassName?: string;
    arrowClassName?: string;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
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
            arrowClassName,
            ...popupProps
        },
        ref
    ) => (
        <BaseTooltip.Portal container={container} keepMounted={keepMounted}>
            <BaseTooltip.Positioner
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                collisionPadding={collisionPadding}
                className={cn("z-50 outline-none", positionerClassName)}
            >
                <BaseTooltip.Popup
                    ref={ref}
                    className={cn(popupBaseClassName, className)}
                    {...popupProps}
                >
                    {children}
                </BaseTooltip.Popup>
            </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
    )
);
TooltipContent.displayName = "Tooltip.Content";

export const Tooltip = Object.assign(TooltipRoot, {
    Provider: TooltipProvider,
    Trigger: TooltipTrigger,
    Portal: TooltipPortal,
    Positioner: TooltipPositioner,
    Popup: TooltipPopup,
    Viewport: TooltipViewport,
    Content: TooltipContent,
    createHandle: BaseTooltip.createHandle
});
