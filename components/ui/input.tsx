import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-border bg-white/90 px-4 py-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted focus:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
