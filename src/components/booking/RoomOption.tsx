import { Check, Info } from "lucide-react";
import type { Room } from "@/types/booking";
import { cn, money } from "@/lib/utils";

/** One room in the booking list: tap the photo or "Room details" to look closer, tap the card to choose it. */
export function RoomOption({
  room,
  note,
  nights,
  selected,
  disabled,
  onSelect,
  onDetails,
}: {
  room: Room;
  note: string;
  nights: number;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onDetails: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl sm:flex-row",
        selected ? "border-2 border-garden bg-garden-soft" : "border border-line bg-white",
        disabled && "opacity-60",
      )}
    >
      {room.image && (
        <button type="button" onClick={onDetails} aria-label={`See ${room.name} photo and details`} className="h-36 shrink-0 sm:h-auto sm:w-40">
          <img src={room.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </button>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          aria-pressed={selected}
          className={cn("flex flex-1 items-center justify-between gap-3 p-4 text-left", disabled && "cursor-not-allowed")}
        >
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-extrabold">{room.name}</span>
            <span className="text-sm text-muted">
              {room.beds}
              {room.airCon ? " · AC" : ""}
            </span>
            <strong className="text-sm text-garden-dark">{note}</strong>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="flex flex-col items-end">
              <span className="text-lg font-extrabold">{money(room.nightlyPrice)}</span>
              <span className="text-xs text-muted">per night</span>
              {nights > 0 && <span className="text-xs font-bold">{money(room.nightlyPrice * nights)} total</span>}
            </span>
            <span
              aria-hidden="true"
              className={cn("flex h-7 w-7 items-center justify-center rounded-lg border-[1.5px] border-garden", selected ? "bg-garden text-white" : "bg-white")}
            >
              {selected && <Check className="h-4 w-4" />}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onDetails}
          className="flex min-h-[44px] items-center gap-1.5 border-t border-line/70 px-4 text-sm font-bold text-garden-dark hover:bg-garden-soft"
        >
          <Info className="h-4 w-4" aria-hidden="true" /> Room details
        </button>
      </div>
    </div>
  );
}
