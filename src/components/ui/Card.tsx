"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, glow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border transition-all duration-200",
          glass
            ? "bg-white/5 backdrop-blur-sm border-white/10"
            : "bg-slate-800/80 border-slate-700/50",
          glow && "hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold text-lg text-slate-100", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-400", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
