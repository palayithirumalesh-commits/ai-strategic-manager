import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-[var(--radius-control)] border border-ink-200 bg-white/80 px-3.5 text-sm text-ink-800 placeholder:text-ink-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-ink-50 dark:placeholder:text-ink-500",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
export { Input };
