"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      success: "bg-green-500/20 text-green-300 border-green-500/30",
      warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      error: "bg-red-500/20 text-red-300 border-red-500/30",
      info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      outline: "bg-transparent text-slate-300 border-slate-600",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
