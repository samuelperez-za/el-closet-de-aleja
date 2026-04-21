export function BrandMark() {
  return (
    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(189,91,133,0.08)]">
      <span className="absolute top-1.5 h-5 w-4 rounded-[999px_999px_6px_999px] bg-[linear-gradient(180deg,var(--primary),var(--secondary-strong))]" />
      <span className="absolute left-2 top-4 h-5 w-4 rotate-[-62deg] rounded-[999px_999px_6px_999px] bg-[linear-gradient(180deg,var(--primary),var(--secondary-strong))]" />
      <span className="absolute right-2 top-4 h-5 w-4 rotate-[62deg] rounded-[999px_999px_6px_999px] bg-[linear-gradient(180deg,var(--primary),var(--secondary-strong))]" />
      <span className="absolute top-6 h-5 w-4 rotate-180 rounded-[999px_999px_6px_999px] bg-[linear-gradient(180deg,var(--primary),var(--secondary-strong))]" />
    </span>
  );
}
