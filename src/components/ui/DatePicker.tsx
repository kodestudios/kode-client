import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/fi";
import { Popover as BasePopover } from "@base-ui/react/popover";
import {
    CalendarBlankIcon,
    CaretLeftIcon,
    CaretRightIcon,
    XIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

dayjs.locale("fi");

type Size = "sm" | "md" | "lg";
type DateValue = Dayjs | null;
type DateInput = Dayjs | Date | string | number | null | undefined;
type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type CalendarView = "day" | "month" | "year";

const YEAR_GRID_SIZE = 12;

function getYearGridStart(year: number): number {
    return Math.floor(year / YEAR_GRID_SIZE) * YEAR_GRID_SIZE;
}

const triggerSizeStyles: Record<Size, string> = {
    sm: "h-6 gap-1 px-2 text-xs",
    md: "h-8 gap-2 px-2.5 text-sm",
    lg: "h-10 gap-2.5 px-3 text-sm"
};

const popupBaseClassName = cn(
    "outline-none",
    "bg-dark-850 text-dark-50 border border-dark-600",
    "rounded-xs shadow-lg shadow-black/40",
    "p-3",
    "[transform-origin:var(--transform-origin)]",
    "transition-[opacity,transform,scale] duration-150 ease-out",
    "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
    "data-[ending-style]:opacity-0 data-[ending-style]:scale-95"
);

const triggerBaseClassName = cn(
    "inline-flex w-full select-none items-center justify-between rounded-xs",
    "bg-dark-700 text-dark-50 border border-dark-600",
    "transition-[background-color,border-color,color] duration-150 ease-out",
    "hover:border-dark-500",
    "data-[popup-open]:border-dark-400 data-[focused]:border-dark-400",
    "focus-visible:border-dark-400",
    "data-[invalid]:border-red-500",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "disabled:pointer-events-none disabled:opacity-50"
);

const DEFAULT_FORMAT = "D.M.YYYY";
const WEEKDAY_LABELS_SHORT = ["su", "ma", "ti", "ke", "to", "pe", "la"];

function toDayjs(value: DateInput): DateValue {
    if (value === null || value === undefined) return null;
    const d = dayjs(value as dayjs.ConfigType);
    return d.isValid() ? d : null;
}

function isSameDay(a: DateValue, b: DateValue): boolean {
    if (!a || !b) return false;
    return a.isSame(b, "day");
}

function clampToBounds(
    date: Dayjs,
    min: DateValue,
    max: DateValue
): Dayjs {
    let next = date;
    if (min && next.isBefore(min, "day")) next = min;
    if (max && next.isAfter(max, "day")) next = max;
    return next;
}

function isOutOfRange(
    date: Dayjs,
    min: DateValue,
    max: DateValue
): boolean {
    if (min && date.isBefore(min, "day")) return true;
    if (max && date.isAfter(max, "day")) return true;
    return false;
}

function useControllableState<T>(
    controlled: T | undefined,
    defaultValue: T,
    onChange?: (value: T) => void
): [T, (next: T) => void] {
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState<T>(defaultValue);
    const value = isControlled ? (controlled as T) : internal;

    const setValue = React.useCallback(
        (next: T) => {
            if (!isControlled) setInternal(next);
            onChange?.(next);
        },
        [isControlled, onChange]
    );

    return [value, setValue];
}

interface DatePickerContextValue {
    value: DateValue;
    setValue: (next: DateValue) => void;
    open: boolean;
    setOpen: (next: boolean) => void;
    min: DateValue;
    max: DateValue;
    isDateDisabled?: (date: Dayjs) => boolean;
    weekStartsOn: WeekDay;
    format: string;
    placeholder: string;
    size: Size;
    disabled: boolean;
    invalid: boolean;
    showClear: boolean;
    showToday: boolean;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(
    null
);

function useDatePickerContext(component: string): DatePickerContextValue {
    const ctx = React.useContext(DatePickerContext);
    if (!ctx) {
        throw new Error(
            `${component} must be rendered inside <DatePicker.Root>`
        );
    }
    return ctx;
}

export interface DatePickerRootProps {
    value?: DateInput;
    defaultValue?: DateInput;
    onValueChange?: (value: DateValue) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    min?: DateInput;
    max?: DateInput;
    isDateDisabled?: (date: Dayjs) => boolean;
    weekStartsOn?: WeekDay;
    format?: string;
    placeholder?: string;
    size?: Size;
    disabled?: boolean;
    invalid?: boolean;
    showClear?: boolean;
    showToday?: boolean;
    modal?: boolean;
    children?: React.ReactNode;
}

function DatePickerRoot({
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 1,
    format = DEFAULT_FORMAT,
    placeholder = "Valitse päivämäärä",
    size = "md",
    disabled = false,
    invalid = false,
    showClear = false,
    showToday = true,
    modal = false,
    children
}: DatePickerRootProps) {
    const [value, setValue] = useControllableState<DateValue>(
        valueProp !== undefined ? toDayjs(valueProp) : undefined,
        toDayjs(defaultValue) ?? null,
        onValueChange
    );

    const [open, setOpen] = useControllableState<boolean>(
        openProp,
        defaultOpen,
        onOpenChange
    );

    const minValue = React.useMemo(() => toDayjs(min), [min]);
    const maxValue = React.useMemo(() => toDayjs(max), [max]);

    const ctx = React.useMemo<DatePickerContextValue>(
        () => ({
            value,
            setValue,
            open,
            setOpen,
            min: minValue,
            max: maxValue,
            isDateDisabled,
            weekStartsOn,
            format,
            placeholder,
            size,
            disabled,
            invalid,
            showClear,
            showToday
        }),
        [
            value,
            setValue,
            open,
            setOpen,
            minValue,
            maxValue,
            isDateDisabled,
            weekStartsOn,
            format,
            placeholder,
            size,
            disabled,
            invalid,
            showClear,
            showToday
        ]
    );

    return (
        <DatePickerContext.Provider value={ctx}>
            <BasePopover.Root
                open={open}
                onOpenChange={setOpen}
                modal={modal}
            >
                {children}
            </BasePopover.Root>
        </DatePickerContext.Provider>
    );
}
DatePickerRoot.displayName = "DatePicker.Root";

export interface DatePickerTriggerProps
    extends Omit<React.ComponentProps<"button">, "value"> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showIcon?: boolean;
    className?: string;
}

const DatePickerTrigger = React.forwardRef<
    HTMLButtonElement,
    DatePickerTriggerProps
>(
    (
        {
            leftIcon,
            rightIcon,
            showIcon = true,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const ctx = useDatePickerContext("DatePicker.Trigger");
        const display = ctx.value ? ctx.value.format(ctx.format) : "";
        const hasValue = display.length > 0;

        const handleClear = (event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault();
            event.stopPropagation();
            ctx.setValue(null);
        };

        return (
            <BasePopover.Trigger
                ref={ref}
                disabled={ctx.disabled}
                data-invalid={ctx.invalid || undefined}
                className={cn(
                    triggerBaseClassName,
                    triggerSizeStyles[ctx.size],
                    className
                )}
                {...props}
            >
                {leftIcon ?? (
                    showIcon && (
                        <CalendarBlankIcon
                            className="size-3.5 shrink-0 text-dark-200"
                            weight="regular"
                            aria-hidden
                        />
                    )
                )}
                <span
                    className={cn(
                        "min-w-0 flex-1 truncate text-left",
                        !hasValue && "text-dark-200"
                    )}
                >
                    {children ?? (hasValue ? display : ctx.placeholder)}
                </span>
                {ctx.showClear && hasValue && !ctx.disabled ? (
                    <span
                        role="button"
                        tabIndex={-1}
                        aria-label="Tyhjennä päivämäärä"
                        onMouseDown={handleClear}
                        className={cn(
                            "ml-1 inline-flex size-4 shrink-0 items-center justify-center rounded-xs",
                            "text-dark-200 hover:bg-dark-600 hover:text-dark-50",
                            "transition-colors duration-100 ease-out"
                        )}
                    >
                        <XIcon className="size-3" weight="bold" aria-hidden />
                    </span>
                ) : (
                    rightIcon
                )}
            </BasePopover.Trigger>
        );
    }
);
DatePickerTrigger.displayName = "DatePicker.Trigger";

interface CalendarHeaderProps {
    view: CalendarView;
    viewDate: Dayjs;
    onPrev: () => void;
    onNext: () => void;
    onHeaderClick: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

function getHeaderLabel(view: CalendarView, viewDate: Dayjs): string {
    if (view === "day") return viewDate.format("MMMM YYYY");
    if (view === "month") return viewDate.format("YYYY");
    const start = getYearGridStart(viewDate.year());
    return `${start} – ${start + YEAR_GRID_SIZE - 1}`;
}

function getPrevLabel(view: CalendarView): string {
    if (view === "day") return "Edellinen kuukausi";
    if (view === "month") return "Edellinen vuosi";
    return "Edelliset vuodet";
}

function getNextLabel(view: CalendarView): string {
    if (view === "day") return "Seuraava kuukausi";
    if (view === "month") return "Seuraava vuosi";
    return "Seuraavat vuodet";
}

function CalendarHeader({
    view,
    viewDate,
    onPrev,
    onNext,
    onHeaderClick,
    canGoPrev,
    canGoNext
}: CalendarHeaderProps) {
    const canDrillUp = view !== "year";
    return (
        <div className="mb-2 flex items-center justify-between gap-1">
            <button
                type="button"
                onClick={onPrev}
                disabled={!canGoPrev}
                aria-label={getPrevLabel(view)}
                className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-xs",
                    "text-dark-100 outline-none",
                    "transition-colors duration-100 ease-out",
                    "hover:bg-dark-700 hover:text-dark-50",
                    "focus-visible:bg-dark-700",
                    "disabled:pointer-events-none disabled:opacity-40"
                )}
            >
                <CaretLeftIcon className="size-3.5" weight="bold" aria-hidden />
            </button>
            <button
                type="button"
                onClick={canDrillUp ? onHeaderClick : undefined}
                disabled={!canDrillUp}
                aria-live="polite"
                aria-label={
                    canDrillUp
                        ? view === "day"
                            ? "Vaihda kuukausinäkymään"
                            : "Vaihda vuosinäkymään"
                        : undefined
                }
                className={cn(
                    "inline-flex h-7 min-w-0 flex-1 select-none items-center justify-center rounded-xs px-2",
                    "text-sm font-medium text-dark-50 tabular-nums outline-none",
                    "transition-colors duration-100 ease-out",
                    canDrillUp &&
                        "cursor-pointer hover:bg-dark-700 focus-visible:bg-dark-700",
                    !canDrillUp && "cursor-default"
                )}
            >
                {getHeaderLabel(view, viewDate)}
            </button>
            <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext}
                aria-label={getNextLabel(view)}
                className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-xs",
                    "text-dark-100 outline-none",
                    "transition-colors duration-100 ease-out",
                    "hover:bg-dark-700 hover:text-dark-50",
                    "focus-visible:bg-dark-700",
                    "disabled:pointer-events-none disabled:opacity-40"
                )}
            >
                <CaretRightIcon
                    className="size-3.5"
                    weight="bold"
                    aria-hidden
                />
            </button>
        </div>
    );
}

interface CalendarGridProps {
    viewDate: Dayjs;
    selected: DateValue;
    onSelect: (date: Dayjs) => void;
    weekStartsOn: WeekDay;
    min: DateValue;
    max: DateValue;
    isDateDisabled?: (date: Dayjs) => boolean;
}

function buildWeekdayLabels(weekStartsOn: WeekDay): string[] {
    return Array.from(
        { length: 7 },
        (_, i) => WEEKDAY_LABELS_SHORT[(weekStartsOn + i) % 7]
    );
}

function buildCalendarDays(viewDate: Dayjs, weekStartsOn: WeekDay): Dayjs[] {
    const startOfMonth = viewDate.startOf("month");
    const offset = (startOfMonth.day() - weekStartsOn + 7) % 7;
    const gridStart = startOfMonth.subtract(offset, "day");
    return Array.from({ length: 42 }, (_, i) => gridStart.add(i, "day"));
}

function CalendarGrid({
    viewDate,
    selected,
    onSelect,
    weekStartsOn,
    min,
    max,
    isDateDisabled
}: CalendarGridProps) {
    const today = React.useMemo(() => dayjs(), []);
    const labels = React.useMemo(
        () => buildWeekdayLabels(weekStartsOn),
        [weekStartsOn]
    );
    const days = React.useMemo(
        () => buildCalendarDays(viewDate, weekStartsOn),
        [viewDate, weekStartsOn]
    );

    return (
        <div role="grid" aria-label={viewDate.format("MMMM YYYY")}>
            <div
                role="row"
                className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium text-dark-200"
            >
                {labels.map((label) => (
                    <div
                        key={label}
                        role="columnheader"
                        className="select-none py-1"
                    >
                        {label}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {days.map((day) => {
                    const inCurrentMonth = day.isSame(viewDate, "month");
                    const isSelected = isSameDay(day, selected);
                    const isToday = day.isSame(today, "day");
                    const outOfRange = isOutOfRange(day, min, max);
                    const customDisabled = isDateDisabled?.(day) ?? false;
                    const disabled = outOfRange || customDisabled;

                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            role="gridcell"
                            aria-selected={isSelected}
                            aria-current={isToday ? "date" : undefined}
                            disabled={disabled}
                            onClick={() => onSelect(day)}
                            tabIndex={isSelected || isToday ? 0 : -1}
                            className={cn(
                                "inline-flex h-8 w-8 select-none items-center justify-center rounded-xs",
                                "border border-transparent",
                                "text-xs tabular-nums outline-none",
                                "transition-[background-color,border-color,color] duration-100 ease-out",
                                inCurrentMonth
                                    ? "text-dark-50"
                                    : "text-dark-300",
                                "hover:bg-dark-700",
                                "focus-visible:border-dark-400",
                                isToday && !isSelected && "border-dark-500",
                                isSelected &&
                                    "bg-primary-100 text-dark-950 hover:bg-primary-300",
                                disabled &&
                                    "pointer-events-none text-dark-400 opacity-50"
                            )}
                        >
                            {day.date()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const cellBaseClassName = cn(
    "inline-flex h-9 select-none items-center justify-center rounded-xs",
    "border border-transparent",
    "text-xs font-medium tabular-nums outline-none",
    "transition-[background-color,border-color,color] duration-100 ease-out",
    "text-dark-50 hover:bg-dark-700",
    "focus-visible:border-dark-400"
);

interface MonthGridProps {
    viewDate: Dayjs;
    selected: DateValue;
    onSelect: (month: number) => void;
    min: DateValue;
    max: DateValue;
}

function MonthGrid({ viewDate, selected, onSelect, min, max }: MonthGridProps) {
    const today = React.useMemo(() => dayjs(), []);
    const year = viewDate.year();
    const monthLabels = React.useMemo(
        () => Array.from({ length: 12 }, (_, i) => dayjs().month(i).format("MMM")),
        []
    );

    return (
        <div
            role="grid"
            aria-label={`Kuukaudet vuonna ${year}`}
            className="grid grid-cols-3 gap-1.5"
        >
            {monthLabels.map((label, m) => {
                const monthStart = viewDate.year(year).month(m).startOf("month");
                const monthEnd = monthStart.endOf("month");
                const beforeMin = !!min && monthEnd.isBefore(min, "day");
                const afterMax = !!max && monthStart.isAfter(max, "day");
                const disabled = beforeMin || afterMax;
                const isSelected =
                    !!selected &&
                    selected.year() === year &&
                    selected.month() === m;
                const isCurrent =
                    today.year() === year && today.month() === m;

                return (
                    <button
                        key={m}
                        type="button"
                        role="gridcell"
                        aria-selected={isSelected}
                        aria-current={isCurrent ? "date" : undefined}
                        disabled={disabled}
                        onClick={() => onSelect(m)}
                        className={cn(
                            cellBaseClassName,
                            isCurrent && !isSelected && "border-dark-500",
                            isSelected &&
                                "bg-primary-100 text-dark-950 hover:bg-primary-300",
                            disabled &&
                                "pointer-events-none text-dark-400 opacity-50"
                        )}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

interface YearGridProps {
    viewDate: Dayjs;
    selected: DateValue;
    onSelect: (year: number) => void;
    min: DateValue;
    max: DateValue;
}

function YearGrid({ viewDate, selected, onSelect, min, max }: YearGridProps) {
    const today = React.useMemo(() => dayjs(), []);
    const startYear = getYearGridStart(viewDate.year());
    const years = React.useMemo(
        () =>
            Array.from({ length: YEAR_GRID_SIZE }, (_, i) => startYear + i),
        [startYear]
    );

    return (
        <div
            role="grid"
            aria-label={`Vuodet ${startYear}–${startYear + YEAR_GRID_SIZE - 1}`}
            className="grid grid-cols-3 gap-1.5"
        >
            {years.map((y) => {
                const yearStart = dayjs().year(y).startOf("year");
                const yearEnd = yearStart.endOf("year");
                const beforeMin = !!min && yearEnd.isBefore(min, "day");
                const afterMax = !!max && yearStart.isAfter(max, "day");
                const disabled = beforeMin || afterMax;
                const isSelected = !!selected && selected.year() === y;
                const isCurrent = today.year() === y;

                return (
                    <button
                        key={y}
                        type="button"
                        role="gridcell"
                        aria-selected={isSelected}
                        aria-current={isCurrent ? "date" : undefined}
                        disabled={disabled}
                        onClick={() => onSelect(y)}
                        className={cn(
                            cellBaseClassName,
                            isCurrent && !isSelected && "border-dark-500",
                            isSelected &&
                                "bg-primary-100 text-dark-950 hover:bg-primary-300",
                            disabled &&
                                "pointer-events-none text-dark-400 opacity-50"
                        )}
                    >
                        {y}
                    </button>
                );
            })}
        </div>
    );
}

export interface DatePickerCalendarProps {
    value?: DateInput;
    defaultValue?: DateInput;
    onValueChange?: (value: DateValue) => void;
    min?: DateInput;
    max?: DateInput;
    isDateDisabled?: (date: Dayjs) => boolean;
    weekStartsOn?: WeekDay;
    showToday?: boolean;
    showClear?: boolean;
    onSelect?: (value: Dayjs) => void;
    className?: string;
}

const DatePickerCalendar = React.forwardRef<
    HTMLDivElement,
    DatePickerCalendarProps
>(
    (
        {
            value: valueProp,
            defaultValue,
            onValueChange,
            min,
            max,
            isDateDisabled,
            weekStartsOn,
            showToday,
            showClear,
            onSelect,
            className
        },
        ref
    ) => {
        const ctx = React.useContext(DatePickerContext);

        const standaloneMin = React.useMemo(() => toDayjs(min), [min]);
        const standaloneMax = React.useMemo(() => toDayjs(max), [max]);

        const [standaloneValue, setStandaloneValue] =
            useControllableState<DateValue>(
                valueProp !== undefined ? toDayjs(valueProp) : undefined,
                toDayjs(defaultValue) ?? null,
                onValueChange
            );

        const effectiveValue = ctx ? ctx.value : standaloneValue;
        const effectiveSetValue = ctx ? ctx.setValue : setStandaloneValue;
        const effectiveMin = ctx ? ctx.min : standaloneMin;
        const effectiveMax = ctx ? ctx.max : standaloneMax;
        const effectiveDisabled = isDateDisabled ?? ctx?.isDateDisabled;
        const effectiveWeekStart = (weekStartsOn ?? ctx?.weekStartsOn ?? 0) as WeekDay;
        const effectiveShowToday = showToday ?? ctx?.showToday ?? true;
        const effectiveShowClear = showClear ?? ctx?.showClear ?? false;

        const initialView = React.useMemo(
            () =>
                clampToBounds(
                    effectiveValue ?? dayjs(),
                    effectiveMin,
                    effectiveMax
                ).startOf("month"),
            // Only seed view from the value/bounds on mount
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        const [viewDate, setViewDate] = React.useState<Dayjs>(initialView);
        const [view, setView] = React.useState<CalendarView>("day");

        React.useEffect(() => {
            if (effectiveValue && !effectiveValue.isSame(viewDate, "month")) {
                setViewDate(effectiveValue.startOf("month"));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [effectiveValue?.valueOf()]);

        // Reset to day view shortly after the popover closes so the next
        // open starts fresh, but wait out the close animation to avoid flash.
        const ctxOpen = ctx?.open;
        React.useEffect(() => {
            if (ctx && !ctxOpen) {
                const timer = window.setTimeout(() => setView("day"), 200);
                return () => window.clearTimeout(timer);
            }
            return undefined;
        }, [ctx, ctxOpen]);

        const canGoPrev = (() => {
            if (!effectiveMin) return true;
            if (view === "day") {
                return !viewDate
                    .subtract(1, "month")
                    .endOf("month")
                    .isBefore(effectiveMin, "day");
            }
            if (view === "month") {
                return !viewDate
                    .subtract(1, "year")
                    .endOf("year")
                    .isBefore(effectiveMin, "day");
            }
            return getYearGridStart(viewDate.year()) > effectiveMin.year();
        })();

        const canGoNext = (() => {
            if (!effectiveMax) return true;
            if (view === "day") {
                return !viewDate
                    .add(1, "month")
                    .startOf("month")
                    .isAfter(effectiveMax, "day");
            }
            if (view === "month") {
                return !viewDate
                    .add(1, "year")
                    .startOf("year")
                    .isAfter(effectiveMax, "day");
            }
            return (
                getYearGridStart(viewDate.year()) + YEAR_GRID_SIZE <=
                effectiveMax.year()
            );
        })();

        const handlePrev = () => {
            if (view === "day") {
                setViewDate((d) => d.subtract(1, "month"));
            } else if (view === "month") {
                setViewDate((d) => d.subtract(1, "year"));
            } else {
                setViewDate((d) => d.subtract(YEAR_GRID_SIZE, "year"));
            }
        };
        const handleNext = () => {
            if (view === "day") {
                setViewDate((d) => d.add(1, "month"));
            } else if (view === "month") {
                setViewDate((d) => d.add(1, "year"));
            } else {
                setViewDate((d) => d.add(YEAR_GRID_SIZE, "year"));
            }
        };

        const handleHeaderClick = () => {
            if (view === "day") setView("month");
            else if (view === "month") setView("year");
        };

        const handleSelect = (day: Dayjs) => {
            effectiveSetValue(day);
            onSelect?.(day);
        };

        const handleMonthSelect = (month: number) => {
            setViewDate((d) => d.month(month));
            setView("day");
        };

        const handleYearSelect = (year: number) => {
            setViewDate((d) => d.year(year));
            setView("month");
        };

        const handleToday = () => {
            const today = clampToBounds(dayjs(), effectiveMin, effectiveMax);
            setViewDate(today.startOf("month"));
            setView("day");
            effectiveSetValue(today);
            onSelect?.(today);
        };

        const handleClear = () => {
            effectiveSetValue(null);
        };

        return (
            <div
                ref={ref}
                className={cn("w-[16rem] select-none", className)}
            >
                <CalendarHeader
                    view={view}
                    viewDate={viewDate}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onHeaderClick={handleHeaderClick}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                />
                {view === "day" && (
                    <CalendarGrid
                        viewDate={viewDate}
                        selected={effectiveValue}
                        onSelect={handleSelect}
                        weekStartsOn={effectiveWeekStart}
                        min={effectiveMin}
                        max={effectiveMax}
                        isDateDisabled={effectiveDisabled}
                    />
                )}
                {view === "month" && (
                    <MonthGrid
                        viewDate={viewDate}
                        selected={effectiveValue}
                        onSelect={handleMonthSelect}
                        min={effectiveMin}
                        max={effectiveMax}
                    />
                )}
                {view === "year" && (
                    <YearGrid
                        viewDate={viewDate}
                        selected={effectiveValue}
                        onSelect={handleYearSelect}
                        min={effectiveMin}
                        max={effectiveMax}
                    />
                )}
                {(effectiveShowToday || effectiveShowClear) && (
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-dark-600 pt-3">
                        {effectiveShowToday ? (
                            <button
                                type="button"
                                onClick={handleToday}
                                className={cn(
                                    "inline-flex h-7 items-center justify-center rounded-xs px-2 text-xs font-medium",
                                    "text-dark-100 outline-none",
                                    "transition-colors duration-100 ease-out",
                                    "hover:bg-dark-700 hover:text-dark-50",
                                    "focus-visible:bg-dark-700"
                                )}
                            >
                                Tänään
                            </button>
                        ) : (
                            <span />
                        )}
                        {effectiveShowClear && effectiveValue && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className={cn(
                                    "inline-flex h-7 items-center justify-center rounded-xs px-2 text-xs font-medium",
                                    "text-dark-100 outline-none",
                                    "transition-colors duration-100 ease-out",
                                    "hover:bg-dark-700 hover:text-dark-50",
                                    "focus-visible:bg-dark-700"
                                )}
                            >
                                Tyhjennä
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
DatePickerCalendar.displayName = "DatePicker.Calendar";

type BasePopoverPositionerProps = React.ComponentProps<
    typeof BasePopover.Positioner
>;
type BasePopoverPortalProps = React.ComponentProps<typeof BasePopover.Portal>;

export interface DatePickerContentProps {
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

const DatePickerContent = React.forwardRef<
    HTMLDivElement,
    DatePickerContentProps
>(
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
            positionerClassName
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
                >
                    {children ?? <DatePickerCalendar />}
                </BasePopover.Popup>
            </BasePopover.Positioner>
        </BasePopover.Portal>
    )
);
DatePickerContent.displayName = "DatePicker.Content";

export interface DatePickerProps extends DatePickerRootProps {
    triggerProps?: Omit<DatePickerTriggerProps, "children">;
    contentProps?: Omit<DatePickerContentProps, "children">;
    calendarProps?: Omit<DatePickerCalendarProps, "value" | "onValueChange">;
    triggerLabel?: React.ReactNode;
}

const DatePickerComponent = React.forwardRef<
    HTMLButtonElement,
    DatePickerProps
>(
    (
        {
            triggerProps,
            contentProps,
            calendarProps,
            triggerLabel,
            children,
            ...rootProps
        },
        ref
    ) => (
        <DatePickerRoot {...rootProps}>
            <DatePickerTrigger ref={ref} {...triggerProps}>
                {triggerLabel}
            </DatePickerTrigger>
            <DatePickerContent {...contentProps}>
                {children ?? <DatePickerCalendar {...calendarProps} />}
            </DatePickerContent>
        </DatePickerRoot>
    )
);
DatePickerComponent.displayName = "DatePicker";

export const DatePicker = Object.assign(DatePickerComponent, {
    Root: DatePickerRoot,
    Trigger: DatePickerTrigger,
    Content: DatePickerContent,
    Calendar: DatePickerCalendar
});

export type { DateValue, DateInput, WeekDay };
