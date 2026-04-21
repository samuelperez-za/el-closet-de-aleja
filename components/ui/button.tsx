import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-white shadow-[0_18px_40px_rgba(189,91,133,0.25)] hover:shadow-[0_24px_48px_rgba(189,91,133,0.3)]",
        secondary:
          "border border-border bg-white/80 text-primary-strong shadow-[0_12px_30px_rgba(189,91,133,0.08)]",
        ghost: "bg-secondary/20 text-foreground hover:bg-secondary/30",
        outline: "border border-border bg-transparent text-foreground hover:bg-white/70",
        danger: "bg-rose-100 text-rose-700 hover:bg-rose-200",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} type={type} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
