import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const SliderSizeContext = React.createContext<Size>("md");

const trackSizeStyles: Record<Size, string> = {
    sm: "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1",
    md: "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
    lg: "data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2"
};

const thumbSizeStyles: Record<Size, string> = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5"
};

const controlSizeStyles: Record<Size, string> = {
    sm: "data-[orientation=horizontal]:py-1.5 data-[orientation=vertical]:px-1.5",
    md: "data-[orientation=horizontal]:py-2 data-[orientation=vertical]:px-2",
    lg: "data-[orientation=horizontal]:py-2.5 data-[orientation=vertical]:px-2.5"
};

const verticalSizeStyles: Record<Size, string> = {
    sm: "data-[orientation=vertical]:h-32",
    md: "data-[orientation=vertical]:h-40",
    lg: "data-[orientation=vertical]:h-48"
};

type BaseSliderRootProps = React.ComponentProps<typeof BaseSlider.Root>;
type BaseSliderLabelProps = React.ComponentProps<typeof BaseSlider.Label>;
type BaseSliderValueProps = React.ComponentProps<typeof BaseSlider.Value>;
type BaseSliderControlProps = React.ComponentProps<typeof BaseSlider.Control>;
type BaseSliderTrackProps = React.ComponentProps<typeof BaseSlider.Track>;
type BaseSliderIndicatorProps = React.ComponentProps<
    typeof BaseSlider.Indicator
>;
type BaseSliderThumbProps = React.ComponentProps<typeof BaseSlider.Thumb>;

export interface SliderRootProps<
    Value extends number | readonly number[] = number | readonly number[]
> extends Omit<
        React.ComponentProps<typeof BaseSlider.Root<Value>>,
        "className"
    > {
    size?: Size;
    className?: string;
}

function SliderRoot<Value extends number | readonly number[]>({
    size = "md",
    className,
    ...props
}: SliderRootProps<Value>) {
    return (
        <SliderSizeContext.Provider value={size}>
            <BaseSlider.Root
                {...(props as BaseSliderRootProps)}
                className={cn(
                    "relative flex touch-none select-none",
                    "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:gap-y-2",
                    "data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-x-2",
                    verticalSizeStyles[size],
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    className
                )}
            />
        </SliderSizeContext.Provider>
    );
}
SliderRoot.displayName = "Slider";

export interface SliderLabelProps
    extends Omit<BaseSliderLabelProps, "className"> {
    className?: string;
}

const SliderLabel = React.forwardRef<HTMLDivElement, SliderLabelProps>(
    ({ className, ...props }, ref) => (
        <BaseSlider.Label
            ref={ref}
            className={cn(
                "block text-xs font-medium text-fg-muted select-none",
                className
            )}
            {...props}
        />
    )
);
SliderLabel.displayName = "Slider.Label";

export interface SliderValueProps
    extends Omit<BaseSliderValueProps, "className"> {
    className?: string;
}

const SliderValue = React.forwardRef<HTMLOutputElement, SliderValueProps>(
    ({ className, ...props }, ref) => (
        <BaseSlider.Value
            ref={ref}
            className={cn(
                "inline-block text-xs tabular-nums text-fg-subtle select-none",
                className
            )}
            {...props}
        />
    )
);
SliderValue.displayName = "Slider.Value";

export interface SliderControlProps
    extends Omit<BaseSliderControlProps, "className"> {
    className?: string;
}

const SliderControl = React.forwardRef<HTMLDivElement, SliderControlProps>(
    ({ className, ...props }, ref) => {
        const size = React.useContext(SliderSizeContext);
        return (
            <BaseSlider.Control
                ref={ref}
                className={cn(
                    "relative flex touch-none select-none",
                    "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:items-center",
                    "data-[orientation=vertical]:h-full data-[orientation=vertical]:justify-center",
                    "data-[disabled]:cursor-not-allowed",
                    controlSizeStyles[size],
                    className
                )}
                {...props}
            />
        );
    }
);
SliderControl.displayName = "Slider.Control";

export interface SliderTrackProps
    extends Omit<BaseSliderTrackProps, "className"> {
    className?: string;
}

const SliderTrack = React.forwardRef<HTMLDivElement, SliderTrackProps>(
    ({ className, ...props }, ref) => {
        const size = React.useContext(SliderSizeContext);
        return (
            <BaseSlider.Track
                ref={ref}
                className={cn(
                    "relative rounded-full",
                    "bg-panel border border-line",
                    "transition-[border-color] duration-150 ease-out",
                    "data-[orientation=horizontal]:w-full",
                    "data-[orientation=vertical]:h-full",
                    trackSizeStyles[size],
                    className
                )}
                {...props}
            />
        );
    }
);
SliderTrack.displayName = "Slider.Track";

export interface SliderIndicatorProps
    extends Omit<BaseSliderIndicatorProps, "className"> {
    className?: string;
}

const SliderIndicator = React.forwardRef<HTMLDivElement, SliderIndicatorProps>(
    ({ className, ...props }, ref) => (
        <BaseSlider.Indicator
            ref={ref}
            className={cn(
                "rounded-full bg-accent",
                "transition-colors duration-150 ease-out",
                "data-[disabled]:bg-emphasis",
                className
            )}
            {...props}
        />
    )
);
SliderIndicator.displayName = "Slider.Indicator";

export interface SliderThumbProps
    extends Omit<BaseSliderThumbProps, "className"> {
    className?: string;
}

const SliderThumb = React.forwardRef<HTMLDivElement, SliderThumbProps>(
    ({ className, ...props }, ref) => {
        const size = React.useContext(SliderSizeContext);
        return (
            <BaseSlider.Thumb
                ref={ref}
                className={cn(
                    "rounded-full bg-accent",
                    "transition-transform duration-150 ease-out",
                    "data-[dragging]:scale-110",
                    "has-[input:focus-visible]:outline-4 has-[input:focus-visible]:outline-accent/20",
                    "data-[disabled]:bg-fg-faint data-[disabled]:shadow-none data-[disabled]:cursor-not-allowed",
                    thumbSizeStyles[size],
                    className
                )}
                {...props}
            />
        );
    }
);
SliderThumb.displayName = "Slider.Thumb";

export const Slider = Object.assign(SliderRoot, {
    Label: SliderLabel,
    Value: SliderValue,
    Control: SliderControl,
    Track: SliderTrack,
    Indicator: SliderIndicator,
    Thumb: SliderThumb
});
