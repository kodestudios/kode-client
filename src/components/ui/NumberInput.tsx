import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";
type Align = "left" | "center" | "right";

const wrapperSizeStyles: Record<Size, string> = {
    sm: "h-6 gap-1 px-2 text-xs",
    md: "h-8 gap-2 px-2.5 text-sm",
    lg: "h-10 gap-2.5 px-3 text-sm"
};

const inputSizeStyles: Record<Size, string> = {
    sm: "h-6 px-2 text-xs",
    md: "h-8 px-2.5 text-sm",
    lg: "h-10 px-3 text-sm"
};

const alignStyles: Record<Align, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
};

const adornmentColor = "text-dark-200";

const baseSurface = [
    "bg-dark-700 text-dark-50",
    "border border-dark-600",
    "transition-[background-color,border-color,color] duration-150 ease-out",
    "hover:border-dark-500",
    "data-[invalid]:border-red-500 aria-invalid:border-red-500",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "disabled:pointer-events-none disabled:opacity-50"
].join(" ");

type BaseInputProps = React.ComponentProps<typeof BaseInput>;

export interface NumberInputProps
    extends Omit<
        BaseInputProps,
        | "className"
        | "size"
        | "type"
        | "value"
        | "defaultValue"
        | "onChange"
        | "prefix"
        | "onBlur"
        | "onKeyDown"
        | "onValueChange"
    > {
    size?: Size;
    align?: Align;
    value?: number | null;
    defaultValue?: number | null;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    decimalPlaces?: number;
    allowNegative?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    invalid?: boolean;
    className?: string;
    wrapperClassName?: string;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function buildPattern(
    allowNegative: boolean,
    decimalPlaces: number | undefined
): RegExp {
    const sign = allowNegative ? "-?" : "";
    if (decimalPlaces === 0) {
        return new RegExp(`^${sign}\\d*$`);
    }
    if (decimalPlaces == null) {
        return new RegExp(`^${sign}\\d*\\.?\\d*$`);
    }
    return new RegExp(`^${sign}\\d*\\.?\\d{0,${decimalPlaces}}$`);
}

function formatNumber(
    value: number | null | undefined,
    decimalPlaces: number | undefined
): string {
    if (value == null || Number.isNaN(value)) return "";
    if (decimalPlaces == null) return String(value);
    return value.toFixed(decimalPlaces);
}

function clamp(
    value: number,
    min: number | undefined,
    max: number | undefined
): number {
    let next = value;
    if (min != null && next < min) next = min;
    if (max != null && next > max) next = max;
    return next;
}

function isPartial(text: string): boolean {
    return text === "" || text === "-" || text === "." || text === "-.";
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            size = "md",
            align = "left",
            value,
            defaultValue,
            onValueChange,
            min,
            max,
            step = 1,
            decimalPlaces,
            allowNegative = false,
            prefix,
            suffix,
            invalid,
            disabled,
            placeholder,
            className,
            wrapperClassName,
            onBlur,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = React.useState<string>(() =>
            formatNumber(
                isControlled ? value ?? null : defaultValue ?? null,
                decimalPlaces
            )
        );

        // Track the last numeric value we emitted so external state updates only
        // re-format the display when they truly differ from what we just emitted.
        // This prevents clobbering intermediate edits like "1." or "-".
        const lastEmittedRef = React.useRef<number | null>(
            isControlled ? value ?? null : defaultValue ?? null
        );

        React.useEffect(() => {
            if (!isControlled) return;
            const next = value ?? null;
            if (next === lastEmittedRef.current) return;
            lastEmittedRef.current = next;
            setInternalValue(formatNumber(next, decimalPlaces));
        }, [value, isControlled, decimalPlaces]);

        const pattern = React.useMemo(
            () => buildPattern(allowNegative, decimalPlaces),
            [allowNegative, decimalPlaces]
        );

        const emit = React.useCallback(
            (parsed: number | null) => {
                lastEmittedRef.current = parsed;
                onValueChange?.(parsed);
            },
            [onValueChange]
        );

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = event.target.value;
            if (isPartial(next)) {
                setInternalValue(next);
                if (lastEmittedRef.current !== null) emit(null);
                return;
            }
            if (!pattern.test(next)) return;
            setInternalValue(next);
            const parsed = Number.parseFloat(next);
            if (Number.isNaN(parsed)) {
                if (lastEmittedRef.current !== null) emit(null);
                return;
            }
            if (parsed !== lastEmittedRef.current) emit(parsed);
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            if (isPartial(internalValue)) {
                setInternalValue("");
                if (lastEmittedRef.current !== null) emit(null);
            } else {
                const parsed = Number.parseFloat(internalValue);
                if (!Number.isNaN(parsed)) {
                    const clamped = clamp(parsed, min, max);
                    setInternalValue(formatNumber(clamped, decimalPlaces));
                    if (clamped !== lastEmittedRef.current) emit(clamped);
                }
            }
            onBlur?.(event);
        };

        const handleKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                const direction = event.key === "ArrowUp" ? 1 : -1;
                const current = Number.parseFloat(internalValue);
                const baseValue = Number.isNaN(current) ? 0 : current;
                const stepped = clamp(baseValue + direction * step, min, max);
                setInternalValue(formatNumber(stepped, decimalPlaces));
                if (stepped !== lastEmittedRef.current) emit(stepped);
            }
            onKeyDown?.(event);
        };

        const sharedInputProps = {
            ref,
            type: "text" as const,
            inputMode: (decimalPlaces === 0 ? "numeric" : "decimal") as
                | "numeric"
                | "decimal",
            disabled,
            placeholder,
            "aria-invalid": invalid || undefined,
            value: internalValue,
            onChange: handleChange,
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            ...props
        };

        if (prefix || suffix) {
            return (
                <div
                    data-disabled={disabled || undefined}
                    data-invalid={invalid || undefined}
                    className={cn(
                        "group relative inline-flex w-full items-center rounded-xs",
                        baseSurface,
                        "focus-within:border-dark-400",
                        "data-[invalid]:focus-within:border-red-500",
                        wrapperSizeStyles[size],
                        wrapperClassName
                    )}
                >
                    {prefix && (
                        <span
                            className={cn(
                                "-ml-0.5 inline-flex shrink-0 select-none items-center justify-center",
                                adornmentColor
                            )}
                            aria-hidden
                        >
                            {prefix}
                        </span>
                    )}
                    <BaseInput
                        {...sharedInputProps}
                        className={cn(
                            "min-w-0 flex-1 bg-transparent tabular-nums text-dark-50 outline-none",
                            "placeholder:text-dark-200",
                            "disabled:cursor-not-allowed",
                            alignStyles[align],
                            className
                        )}
                    />
                    {suffix && (
                        <span
                            className={cn(
                                "-mr-0.5 inline-flex shrink-0 select-none items-center justify-center",
                                adornmentColor
                            )}
                            aria-hidden
                        >
                            {suffix}
                        </span>
                    )}
                </div>
            );
        }

        return (
            <BaseInput
                {...sharedInputProps}
                className={cn(
                    "block w-full rounded-xs tabular-nums",
                    baseSurface,
                    "placeholder:text-dark-200",
                    "focus:border-dark-400 data-[focused]:border-dark-400",
                    "data-[invalid]:focus:border-red-500",
                    "disabled:cursor-not-allowed",
                    inputSizeStyles[size],
                    alignStyles[align],
                    className
                )}
            />
        );
    }
);

NumberInput.displayName = "NumberInput";
