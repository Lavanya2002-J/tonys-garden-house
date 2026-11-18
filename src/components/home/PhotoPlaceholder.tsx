import { cn } from "@/lib/utils";
import { ZoomImage } from "./ZoomImage";

const tones = {
  garden: "bg-[#DCE6D8]",
  sand: "bg-[#E9DFCC]",
  gold: "bg-[#F3E2B8]",
} as const;

/** Shows a real photo when `src` is given, otherwise a coloured placeholder. */
export function PhotoPlaceholder({
  label,
  className,
  tone = "sand",
  src,
  imgClassName,
}: {
  label: string;
  className?: string;
  tone?: keyof typeof tones;
  src?: string;
  /** Extra classes for the photo itself (e.g. crop position). */
  imgClassName?: string;
}) {
  if (src) {
    return <ZoomImage src={src} alt={label} className={className} imgClassName={imgClassName} />;
  }
  return (
    <div role="img" aria-label={label} className={cn("flex items-end rounded-2xl p-3", tones[tone], className)}>
      <span className="rounded-full bg-cream/90 px-3 py-1 text-xs font-bold text-garden-dark">{label}</span>
    </div>
  );
}
