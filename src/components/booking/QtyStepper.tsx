import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string; // what is being counted, for screen readers
}

export function QtyStepper({ value, min, max, onChange, label }: Props) {
  return (
    <div className="flex items-center gap-2.5" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Fewer: ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-xl border-[1.5px] border-garden bg-white text-garden-dark disabled:opacity-40"
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>
      <span className="min-w-[1.5rem] text-center text-lg font-extrabold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`More: ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-xl border-[1.5px] border-garden bg-white text-garden-dark disabled:opacity-40"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
