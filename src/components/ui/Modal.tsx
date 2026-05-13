import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg" | "xl";

const sizeStyles: Record<Size, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl"
};

type BaseDialogRootProps = React.ComponentProps<typeof BaseDialog.Root>;

export interface ModalProps
    extends Omit<BaseDialogRootProps, "children" | "render"> {
    title?: React.ReactNode;
    trigger?: React.ReactElement;
    size?: Size;
    showClose?: boolean;
    children?: React.ReactNode;
    className?: string;
    backdropClassName?: string;
    titleClassName?: string;
    bodyClassName?: string;
}

const ModalRoot = ({
    title,
    trigger,
    size = "md",
    showClose = true,
    children,
    className,
    backdropClassName,
    titleClassName,
    bodyClassName,
    ...rootProps
}: ModalProps) => {
    return (
        <BaseDialog.Root {...rootProps}>
            {trigger && <BaseDialog.Trigger render={trigger} />}
            <BaseDialog.Portal>
                <BaseDialog.Backdrop
                    className={cn(
                        "fixed inset-0 z-50 bg-black/30",
                        "transition-opacity duration-200 ease-out",
                        "data-[starting-style]:opacity-0",
                        "data-[ending-style]:opacity-0",
                        backdropClassName
                    )}
                />
                <BaseDialog.Popup
                    className={cn(
                        "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
                        "bg-dark-850 text-dark-50 border border-dark-600",
                        "rounded-xs shadow-lg shadow-black/40",
                        "p-4 outline-none",
                        "transition-[opacity,transform,scale] duration-200 ease-out",
                        "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
                        "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
                        sizeStyles[size],
                        className
                    )}
                >
                    {(title || showClose) && (
                        <div className="mb-3 flex items-start justify-between gap-4">
                            {title ? (
                                <BaseDialog.Title
                                    className={cn(
                                        "text-base leading-tight font-semibold text-dark-50",
                                        titleClassName
                                    )}
                                >
                                    {title}
                                </BaseDialog.Title>
                            ) : (
                                <span aria-hidden />
                            )}
                            {showClose && (
                                <BaseDialog.Close
                                    aria-label="Close"
                                    className={cn(
                                        "-m-1 inline-flex size-7 shrink-0 items-center justify-center rounded-xs",
                                        "text-dark-50",
                                        "transition-[background-color,color,transform] duration-150 ease-out",
                                        "hover:bg-dark-600",
                                        "active:bg-dark-500 active:scale-[0.98]"
                                    )}
                                >
                                    <XIcon
                                        className="size-4"
                                        weight="bold"
                                        aria-hidden
                                    />
                                </BaseDialog.Close>
                            )}
                        </div>
                    )}
                    <div className={cn("text-sm text-dark-100", bodyClassName)}>
                        {children}
                    </div>
                </BaseDialog.Popup>
            </BaseDialog.Portal>
        </BaseDialog.Root>
    );
};

ModalRoot.displayName = "Modal";

type BaseModalTriggerProps = React.ComponentProps<typeof BaseDialog.Trigger>;
export interface ModalTriggerProps extends BaseModalTriggerProps {}

const ModalTrigger = BaseDialog.Trigger as React.FC<ModalTriggerProps>;
(ModalTrigger as { displayName?: string }).displayName = "Modal.Trigger";

type BaseModalCloseProps = React.ComponentProps<typeof BaseDialog.Close>;
export interface ModalCloseProps extends BaseModalCloseProps {}

const ModalClose = BaseDialog.Close as React.FC<ModalCloseProps>;
(ModalClose as { displayName?: string }).displayName = "Modal.Close";

export const Modal = Object.assign(ModalRoot, {
    Trigger: ModalTrigger,
    Close: ModalClose
});
