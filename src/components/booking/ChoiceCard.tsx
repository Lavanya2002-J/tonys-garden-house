import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
}

/** A tappable card for one choice (room, breakfast, payment method). */
export function ChoiceCard({ selected, disabled, onSelect, title, description, aside }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition",
        selected ? "border-2 border-garden bg-garden-soft" : "border border-line bg-white hover:border-garden",
        disabled && "cursor-not-allowed opacity-50 hover:border-line",
      )}
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-extrabold">{title}</span>
        {description && <span className="text-sm text-muted">{description}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {aside}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border-[1.5px] border-garden",
            selected ? "bg-garden text-white" : "bg-white",
          )}
        >
          {selected && <Check className="h-4 w-4" />}
        </span>
      </span>
    </button>
  );
}
