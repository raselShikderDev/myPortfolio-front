import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const marqueeVariants = cva(
  "flex overflow-hidden select-none gap-4",
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof marqueeVariants> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      variant,
      reverse,
      pauseOnHover = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(marqueeVariants({ variant }), className)}
        {...props}
      >
        <div className={cn("flex shrink-0 gap-4 py-4 w-max flex-nowrap", reverse && "animate-marquee-reverse", pauseOnHover && "hover:[animation-play-state:paused]")}>
          {children}
        </div>
        <div
          className={cn("flex shrink-0 gap-4 py-4 w-max flex-nowrap", reverse && "animate-marquee-reverse", pauseOnHover && "hover:[animation-play-state:paused]")}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

export { Marquee };