import type { Quote, Room } from "@/types/booking";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  room: Room | undefined;
  stay: string;
  quote: Quote;
  className?: string;
}

/** Itemised price, used in the sidebar, the review step and the confirmation page. */
export function OrderSummary({ room, stay, quote, className }: Props) {
  return (
    <div className={cn("card flex flex-col gap-2 p-4", className)}>
      <span className="font-extrabold">{room ? room.name : "Your stay"}</span>
      {stay && <span className="text-sm text-muted">{stay}</span>}
      {quote.lines.length > 0 && <hr className="border-line" />}
      <ul className="flex flex-col gap-1.5 text-sm">
        {quote.lines.map((l) => (
          <li key={l.label} className="flex justify-between gap-3">
            <span>{l.label}</span>
            <span className={cn(l.kind === "discount" && "font-extrabold text-garden-dark")}>{money(l.amount)}</span>
          </li>
        ))}
      </ul>
      <hr className="border-line" />
      <div className="flex justify-between text-lg font-extrabold">
        <span>Total</span>
        <span>{money(quote.total)}</span>
      </div>
      <p className="text-xs font-bold text-garden-dark">No booking-site fees. Every rupee goes to Tony.</p>
    </div>
  );
}
