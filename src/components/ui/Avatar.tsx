import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "@/lib/cn";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Shape = "circle" | "square";

const sizeStyles: Record<Size, string> = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "size-16 text-lg"
};

const shapeStyles: Record<Shape, string> = {
    circle: "rounded-full",
    square: "rounded-xs"
};

type BaseAvatarRootProps = React.ComponentProps<typeof BaseAvatar.Root>;

export interface AvatarRootProps
    extends Omit<BaseAvatarRootProps, "className"> {
    size?: Size;
    shape?: Shape;
    className?: string;
}

const AvatarRoot = React.forwardRef<HTMLSpanElement, AvatarRootProps>(
    ({ size = "md", shape = "circle", className, children, ...props }, ref) => {
        return (
            <BaseAvatar.Root
                ref={ref}
                className={cn(
                    "inline-flex shrink-0 select-none items-center justify-center overflow-hidden align-middle",
                    "bg-panel text-fg border border-line",
                    "font-medium",
                    sizeStyles[size],
                    shapeStyles[shape],
                    className
                )}
                {...props}
            >
                {children}
            </BaseAvatar.Root>
        );
    }
);

AvatarRoot.displayName = "Avatar";

type BaseAvatarImageProps = React.ComponentProps<typeof BaseAvatar.Image>;

export interface AvatarImageProps
    extends Omit<BaseAvatarImageProps, "className"> {
    className?: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
    ({ className, ...props }, ref) => {
        return (
            <BaseAvatar.Image
                ref={ref}
                className={cn(
                    "h-full w-full object-cover",
                    "transition-opacity duration-150 ease-out",
                    "data-[starting-style]:opacity-0",
                    "data-[ending-style]:opacity-0",
                    className
                )}
                {...props}
            />
        );
    }
);

AvatarImage.displayName = "Avatar.Image";

type BaseAvatarFallbackProps = React.ComponentProps<typeof BaseAvatar.Fallback>;

export interface AvatarFallbackProps
    extends Omit<BaseAvatarFallbackProps, "className"> {
    className?: string;
}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
    ({ className, delay = 200, ...props }, ref) => {
        return (
            <BaseAvatar.Fallback
                ref={ref}
                delay={delay}
                className={cn(
                    "inline-flex h-full w-full items-center justify-center",
                    "uppercase leading-none tracking-tight",
                    className
                )}
                {...props}
            />
        );
    }
);

AvatarFallback.displayName = "Avatar.Fallback";

export const Avatar = Object.assign(AvatarRoot, {
    Image: AvatarImage,
    Fallback: AvatarFallback
});
