import { cn } from "@/lib/utils";

/** Section title with a small label above and a leaf-line accent below. */
export function SectionHeading({
  eyebrow,
  title,
  light = false,
  className,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className={cn("flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em]", light ? "text-[#F2C66D]" : "text-[#8A5A2B]")}>
        {eyebrow}
      </span>
      <h2 className={cn("text-3xl md:text-4xl", light ? "text-cream" : "text-garden-dark")}>{title}</h2>
      <span aria-hidden="true" className="mt-1 flex items-center gap-1.5">
        <span className={cn("h-1 w-10 rounded-full", light ? "bg-[#F2C66D]" : "bg-garden")} />
        <span className={cn("h-1 w-2 rounded-full", light ? "bg-cream/40" : "bg-sophie")} />
      </span>
    </div>
  );
}
