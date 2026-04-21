import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.02em] text-primary-strong",
        className,
      )}
    >
      {children}
    </span>
  );
}
