import { site } from "@/config/site";

/** House + garden leaf mark. Swap for Tony's final logo when it exists. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="10" className="fill-garden" />
      <path d="M8 18 L18 9 L28 18 V28 H8 Z" fill="none" stroke="#FAF6EE" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 27 C18 21 21 18 25 17 C25 22 22 25 18 27 Z" className="fill-sophie" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[17px] font-bold">{site.name}</span>
        <span className="text-[11px] uppercase tracking-[0.06em] text-muted">{site.subTitle}</span>
      </span>
    </span>
  );
}
