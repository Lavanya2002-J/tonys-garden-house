import type { Extra, Quote, QuoteLine, Room } from "@/types/booking";

export interface QuoteInput {
  room: Room | undefined;
  nights: number;
  guests: number;
  breakfast: boolean;
  extras: Record<string, number>;
  catalog: Extra[];
  breakfastPricePerGuest: number;
  /** Free breakfast mornings for direct bookings (the "book direct" perk). */
  freeBreakfastMornings: number;
}

/**
 * Pure price calculation: the booking page, review step, confirmation message
 * and Tony's admin all use this, so the guest and Tony never see different totals.
 */
export function quote(input: QuoteInput): Quote {
  const { room, guests, breakfast, extras, catalog, breakfastPricePerGuest } = input;
  const nights = Math.max(0, input.nights);
  const lines: QuoteLine[] = [];

  if (room && nights > 0) {
    lines.push({ kind: "room", label: `${room.name} × ${nights} ${nights === 1 ? "night" : "nights"}`, amount: room.nightlyPrice * nights });
  }

  if (breakfast && nights > 0) {
    lines.push({ kind: "breakfast", label: `Breakfast × ${guests} × ${nights}`, amount: breakfastPricePerGuest * guests * nights });
    const freeMornings = Math.min(input.freeBreakfastMornings, nights);
    if (freeMornings > 0) {
      lines.push({ kind: "discount", label: "Book direct: free breakfast", amount: -breakfastPricePerGuest * guests * freeMornings });
    }
  }

  for (const extra of catalog) {
    const qty = extras[extra.id] ?? 0;
    if (qty <= 0) continue;
    const amount = extra.pricing === "per_unit_per_night" ? extra.price * qty * Math.max(1, nights) : extra.price * qty;
    lines.push({ kind: "extra", label: `${extra.name} × ${qty}`, amount });
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { nights, lines, total };
}

/** Highest quantity allowed for an extra, given the party size. */
export function maxExtraQty(extra: Extra, guests: number): number {
  return extra.maxQty ?? Math.max(1, guests);
}

/** Booking-site commission Tony avoids on a direct booking. */
export function commissionSaved(total: number, commissionRate = 0.15): number {
  return Math.round(total * commissionRate * 100) / 100;
}
