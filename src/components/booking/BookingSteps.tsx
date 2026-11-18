import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const BOOKING_STEPS = ["Dates", "Room", "Extras", "Details", "Pay"] as const;

interface Props {
  current: number; // 1-based
  onEdit: (step: number) => void;
}

/** Numbered steps; finished ones get a tick and can be tapped to go back and edit. */
export function BookingSteps({ current, onEdit }: Props) {
  return (
    <nav aria-label="Booking steps" className="border-b border-line bg-white">
      <ol className="container flex items-center justify-between gap-1 py-3 sm:justify-center sm:gap-2">
        {BOOKING_STEPS.map((label, i) => {
          const n = i + 1;
          const done = current > n;
          const active = current === n;
          return (
            <li key={label} className="flex items-center">
              <button
                type="button"
                disabled={!done}
                onClick={() => onEdit(n)}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${n}, ${label}${done ? ", done, tap to edit" : active ? ", current" : ""}`}
                className="flex min-h-[44px] min-w-[52px] flex-col items-center gap-1 disabled:cursor-default sm:flex-row sm:gap-2"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-extrabold",
                    done || active ? "bg-garden text-white" : "bg-sand text-muted",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : n}
                </span>
                <span className={cn("text-[11px] font-bold sm:text-sm", active ? "text-garden-dark" : done ? "text-bark" : "text-muted")}>
                  {label}
                </span>
              </button>
              {n < BOOKING_STEPS.length && (
                <span aria-hidden="true" className={cn("mx-1 hidden h-0.5 w-10 sm:block", done ? "bg-garden" : "bg-sand")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
