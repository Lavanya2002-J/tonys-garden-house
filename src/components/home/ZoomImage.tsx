import { useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** A photo you can tap to see full size. Esc, the X button or a click outside closes it. */
export function ZoomImage({
  src,
  alt,
  className,
  imgClassName,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const opener = openerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        style={style}
        className={cn("block cursor-zoom-in overflow-hidden rounded-2xl", className)}
      >
        <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", imgClassName)} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close photo"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      )}
    </>
  );
}
