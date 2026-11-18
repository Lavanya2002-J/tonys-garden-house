import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IsoDate } from "@/types/booking";
import { fromIso, monthGrid, monthTitle, nightsBetween, shortDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface Props {
  today: IsoDate;
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
  /** Rooms free that night (0 = full). */
  freeOn: (night: IsoDate) => number;
  onPick: (date: IsoDate) => void;
  onClear?: () => void;
}

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Month calendar: tap arrival, then departure. Full nights can still be a check-out day. */
export function StayCalendar({ today, checkIn, checkOut, freeOn, onPick, onClear }: Props) {
  const [hover, setHover] = useState<IsoDate | null>(null);
  const start = fromIso(today);
  const [offset, setOffset] = useState(0);
  const year = start.getUTCFullYear() + Math.floor((start.getUTCMonth() + offset) / 12);
  const month = (start.getUTCMonth() + offset) % 12;
  const cells = useMemo(() => monthGrid(year, month), [year, month]);

  const choosingCheckOut = !!checkIn && !checkOut;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label="Previous month"
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-garden-soft disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="font-extrabold">{monthTitle(year, month)}</span>
        <button
          type="button"
          onClick={() => setOffset((o) => Math.min(11, o + 1))}
          aria-label="Next month"
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-garden-soft"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {nights > 0 ? (
            <>
              <strong className="text-bark">{nights === 1 ? "1 night" : `${nights} nights`}</strong> · {shortDate(checkIn!)} to {shortDate(checkOut!)}
            </>
          ) : choosingCheckOut ? (
            `Arriving ${shortDate(checkIn!)}. Now tap your departure day.`
          ) : (
            "Tap your arrival day."
          )}
        </p>
        {checkIn && onClear && (
          <button type="button" onClick={onClear} className="min-h-[44px] shrink-0 px-2 text-sm font-bold text-garden-dark underline underline-offset-4">
            Clear dates
          </button>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted">
        {WEEK.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`pad-${i}`} />;
          const past = iso < today;
          const free = past ? 0 : freeOn(iso);
          const full = !past && free === 0;
          // A full night can still be picked as the departure day: nobody sleeps there that night.
          const canCheckOutHere = choosingCheckOut && iso > checkIn!;
          const disabled = past || (full && !canCheckOutHere);
          const inStay = checkIn && checkOut && iso >= checkIn && iso < checkOut;
          const isEdge = iso === checkIn || iso === checkOut;
          // While choosing the departure day, preview the nights up to the day under the pointer.
          const inPreview = choosingCheckOut && !!hover && hover > checkIn! && iso > checkIn! && iso <= hover && !disabled;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onPick(iso)}
              onMouseEnter={() => setHover(iso)}
              onMouseLeave={() => setHover(null)}
              aria-pressed={!!(inStay || isEdge)}
              aria-label={`${shortDate(iso)}${isToday ? ", today" : ""}${past ? ", past" : full ? ", full" : `, ${free} rooms free`}`}
              className={cn(
                "flex min-h-[50px] flex-col items-center justify-center rounded-lg border text-bark transition",
                past && "cursor-not-allowed border-transparent bg-transparent text-muted/50",
                full && !past && "border-transparent bg-sand text-muted line-through",
                full && !past && !disabled && "cursor-pointer",
                full && !past && disabled && "cursor-not-allowed",
                !past && !full && "border-line bg-white hover:border-garden",
                inPreview && "border-garden/40 bg-garden-soft",
                inStay && "border-garden bg-garden text-white",
                isEdge && "border-2 border-sophie",
                isToday && !isEdge && !inStay && "ring-2 ring-garden/40 ring-offset-1",
              )}
            >
              <span className="text-[15px] font-extrabold">{fromIso(iso).getUTCDate()}</span>
              {!past && <span className="text-[10px] font-bold">{full ? "Full" : `${free} left`}</span>}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-garden" />Your stay</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-sand" />Full</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded ring-2 ring-garden/40" />Today</span>
      </div>
    </div>
  );
}
