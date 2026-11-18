import type { Booking, IsoDate, Room } from "@/types/booking";
import type { Occupancy } from "./availability";
import { roomsFreeOnNight } from "./availability";
import { commissionSaved } from "./pricing";

/**
 * Tony's run sheet for one day (like the staff Day Operations screen):
 * who arrives, who leaves, money still to collect, what to prepare.
 * Pure, so it is easy to test and to reuse on the server for the 7am WhatsApp summary.
 */
export interface DaySheet {
  arrivals: Booking[];
  departures: Booking[];
  inHouse: Booking[];
  freeTonight: number;
  totalRooms: number;
  toCollect: number;
  breakfastGuests: number;
  pickups: Booking[];
  directThisMonth: number;
  commissionSavedThisMonth: number;
}

export function needsPayment(b: Booking): boolean {
  return b.status !== "cancelled" && !b.paid && b.paymentMethod !== "paid_on_channel";
}

export function daySheet(day: IsoDate, rooms: Room[], o: Occupancy): DaySheet {
  const active = o.bookings.filter((b) => b.status !== "cancelled");
  const arrivals = active.filter((b) => b.checkIn === day);
  const departures = active.filter((b) => b.checkOut === day);
  const inHouse = active.filter((b) => b.checkIn <= day && day < b.checkOut);
  // Breakfast this morning = everyone who slept here last night and booked breakfast.
  const breakfastGuests = active
    .filter((b) => b.breakfast && b.checkIn < day && day <= b.checkOut)
    .reduce((n, b) => n + b.guests, 0);
  const toCollect = [...arrivals, ...inHouse.filter((b) => b.checkIn !== day)]
    .filter(needsPayment)
    .reduce((sum, b) => sum + b.total, 0);
  const month = day.slice(0, 7);
  const directMonth = active.filter((b) => b.source === "direct" && b.checkIn.slice(0, 7) === month);

  return {
    arrivals,
    departures,
    inHouse,
    freeTonight: roomsFreeOnNight(day, rooms, o),
    totalRooms: rooms.length,
    toCollect,
    breakfastGuests,
    pickups: arrivals.filter((b) => (b.extras.pickup ?? 0) > 0),
    directThisMonth: directMonth.length,
    commissionSavedThisMonth: directMonth.reduce((s, b) => s + commissionSaved(b.total), 0),
  };
}
