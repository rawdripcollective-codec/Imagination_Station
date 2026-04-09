"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-slate-300">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-slate-300">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "flex w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
});
Select.displayName = "Select";
