import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-700",
        violet: "bg-violet-100 text-violet-700",
        success: "bg-success-100 text-success-500",
        warning: "bg-warning-100 text-warning-500",
        danger: "bg-danger-100 text-danger-500",
        outline: "border border-ink-200 text-ink-500 dark:border-white/15",
        neutral: "bg-ink-100 text-ink-600 dark:bg-white/10",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
