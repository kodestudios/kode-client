import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastKind = "default" | "success" | "info" | "warning" | "error" | "loading";

type ToastActionContext = {
    id: string;
    dismiss: () => void;
};

export type ToastAction = {
    label: React.ReactNode;
    onClick: (context: ToastActionContext) => void | Promise<void>;
    dismissOnClick?: boolean;
    variant?: "primary" | "secondary" | "destructive";
};

export type ToastData = {
    id?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: ToastAction[];
    indestructible?: boolean;
    duration?: number;
};

const toneStyles: Record<ToastKind, string> = {
    default: "bg-fg-subtle",
    success: "bg-emerald-400",
    info: "bg-sky-400",
    warning: "bg-amber-400",
    error: "bg-red-400",
    loading: "bg-accent"
};

const actionStyles: Record<NonNullable<ToastAction["variant"]>, string> = {
    primary: "bg-accent text-on-accent hover:bg-accent-hover",
    secondary: "bg-muted text-fg hover:bg-strong",
    destructive: "bg-red-500 text-fg hover:bg-red-600"
};

let toastSequence = 0;

function createToastId(prefix = "toast") {
    toastSequence += 1;
    return `${prefix}-${toastSequence}`;
}

function ToastContent({ data, id, kind }: { data: ToastData; id: string; kind: ToastKind }) {
    const [pendingAction, setPendingAction] = React.useState<number | null>(null);

    const dismiss = React.useCallback(() => {
        sonnerToast.dismiss(id);
    }, [id]);

    return (
        <div className="w-80 rounded-sm border border-line bg-elevated p-3 text-fg shadow-2xl shadow-sunken/50">
            <div className="flex gap-3">
                <span className={`mt-1 size-2 shrink-0 rounded-full ${toneStyles[kind]}`} />
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-5 text-fg">
                        {data.title}
                    </div>
                    {data.description && (
                        <div className="mt-1 text-sm leading-5 text-fg-muted">
                            {data.description}
                        </div>
                    )}
                </div>
            </div>

            {data.actions?.length ? (
                <div className="mt-3 flex flex-wrap justify-end gap-2 pl-5">
                    {data.actions.map((action, index) => {
                        const variant = action.variant ?? (index === 0 ? "primary" : "secondary");
                        const isPending = pendingAction === index;

                        return (
                            <button
                                key={index}
                                type="button"
                                disabled={pendingAction !== null}
                                className={`inline-flex h-7 items-center rounded-xs px-2.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 ${actionStyles[variant]}`}
                                onClick={async () => {
                                    try {
                                        setPendingAction(index);
                                        await action.onClick({ id, dismiss });

                                        if (action.dismissOnClick ?? true) {
                                            dismiss();
                                        }
                                    } finally {
                                        setPendingAction(null);
                                    }
                                }}
                            >
                                {isPending ? "Working..." : action.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

function showToast(kind: ToastKind, data: ToastData) {
    const id = data.id ?? createToastId(kind);
    const persistent = data.indestructible || data.actions?.length;

    sonnerToast.custom(
        () => <ToastContent data={data} id={id} kind={kind} />,
        {
            id,
            duration: persistent ? Infinity : data.duration,
            dismissible: !persistent,
            position: "bottom-right",
            unstyled: true
        }
    );

    return id;
}

export const toast = {
    id: createToastId,
    dismiss: sonnerToast.dismiss,
    default: (data: ToastData) => showToast("default", data),
    success: (data: ToastData) => showToast("success", data),
    info: (data: ToastData) => showToast("info", data),
    warning: (data: ToastData) => showToast("warning", data),
    error: (data: ToastData) => showToast("error", data),
    loading: (data: ToastData) => showToast("loading", data)
};