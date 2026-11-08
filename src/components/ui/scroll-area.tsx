import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = ScrollAreaPrimitive.Root;
ScrollArea.displayName = "ScrollArea";

const Scrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn("flex bg-scrollbar-border", className)}
    {...props}
  />
));
Scrollbar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;

const ScrollbarThumb = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb ref={ref} className={cn("block bg-scrollbar-thumb rounded-full ring-offset-scrollbar-border", className)} {...props} />
));
ScrollbarThumb.displayName = "ScrollbarThumb";

const ScrollbarContent = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport ref={ref} className={cn("scroll-smooth snap-mandatory overflow-hidden py-2", className)} {...props} />
));
ScrollbarContent.displayName = "ScrollbarContent";

export { ScrollArea, Scrollbar, ScrollbarThumb, ScrollbarContent };
