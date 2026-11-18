import { useEffect, useRef } from "react";
import { BedDouble, Bath, Snowflake, Users, X } from "lucide-react";
import type { Room } from "@/types/booking";
import { money } from "@/lib/utils";

/** Bigger photo and the facts about one room. Optionally lets the guest choose it right here. */
export function RoomDialog({
  room,
  onClose,
  onChoose,
  chooseLabel = "Choose this room",
}: {
  room: Room;
  onClose: () => void;
  onChoose?: () => void;
  chooseLabel?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  const facts = [
    { icon: BedDouble, label: "Beds", value: room.beds },
    { icon: Users, label: "Sleeps", value: `Up to ${room.capacity} guests` },
    { icon: Bath, label: "Bathroom", value: room.bathroom === "private" ? "Private" : "Shared" },
    { icon: Snowflake, label: "Air conditioning", value: room.airCon ? "Yes" : "No" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={room.name}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream shadow-xl sm:rounded-3xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close room details"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {room.image && <img src={room.image} alt={room.name} className="h-56 w-full object-cover sm:h-64" />}
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-2xl text-garden-dark">{room.name}</h2>
            <span className="shrink-0 text-sm text-muted">
              <strong className="text-xl text-bark">{money(room.nightlyPrice)}</strong> / night
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-2">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5 rounded-xl bg-white p-3 ring-1 ring-line">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-garden-dark" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="text-sm font-extrabold">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted">Every room has a kitchenette, dining table and its own entrance. Price is per room per night.</p>
          {onChoose && (
            <button type="button" onClick={onChoose} className="btn-primary min-h-[52px] w-full text-base">
              {chooseLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
