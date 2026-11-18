import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/images/exterior.webp", alt: "Tony's Garden House, Jaffna", crop: "origin-bottom scale-[1.35]" },
  { src: "/images/garden.webp", alt: "The garden with mango trees", crop: "" },
  { src: "/images/terrace.webp", alt: "Terrace with seating", crop: "" },
  { src: "/images/breakfast.webp", alt: "Homemade Jaffna breakfast", crop: "" },
  { src: "/images/garden-hut.webp", alt: "Thatched garden hut", crop: "" },
];

/** Crossfading photo slideshow. Pauses on hover/focus; no autoplay if the visitor prefers reduced motion. */
export function HeroCarousel({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused, reduced]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Photos of Tony's Garden House"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative overflow-hidden rounded-2xl bg-[#DCE6D8]", className)}
    >
      {slides.map((s, n) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={n === 0 ? "eager" : "lazy"}
          aria-hidden={n !== i}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", s.crop, n === i ? "opacity-100" : "opacity-0")}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
        <span className="text-sm font-bold text-white drop-shadow">{slides[i].alt}</span>
        <div className="flex">
          {slides.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}: ${s.alt}`}
              aria-current={n === i}
              className="flex h-9 w-6 items-center justify-center"
            >
              <span className={cn("h-2 rounded-full bg-white transition-all", n === i ? "w-5" : "w-2 opacity-60")} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
