import type { Block, Booking, IsoDate, Room } from "@/types/booking";
import { addDays, eachNight, overlaps } from "./dates";

/** Everything that takes a room: our bookings plus nights blocked from other channels. */
export interface Occupancy {
  bookings: Booking[];
  blocks: Block[];
}

/** Is this room free for every night of the stay (no booking or imported block)? */
export function isRoomFree(roomId: string, checkIn: IsoDate, checkOut: IsoDate, o: Occupancy): boolean {
  const booked = o.bookings.some(
    (b) => b.status !== "cancelled" && b.roomId === roomId && overlaps(checkIn, checkOut, b.checkIn, b.checkOut),
  );
  const blocked = o.blocks.some((bl) => bl.roomId === roomId && overlaps(checkIn, checkOut, bl.start, bl.end));
  return !booked && !blocked;
}

/** How many rooms are free on one night. */
export function roomsFreeOnNight(night: IsoDate, rooms: Room[], o: Occupancy): number {
  const next = addDays(night, 1);
  return rooms.filter((r) => isRoomFree(r.id, night, next, o)).length;
}

/** Rooms the guest can book: big enough and free for the whole stay. */
export function availableRooms(rooms: Room[], guests: number, checkIn: IsoDate, checkOut: IsoDate, o: Occupancy): Room[] {
  return rooms.filter((r) => r.capacity >= guests && isRoomFree(r.id, checkIn, checkOut, o));
}

/** The first night in a stay with no room free at all, to explain why dates don't work. */
export function firstFullNight(rooms: Room[], checkIn: IsoDate, checkOut: IsoDate, o: Occupancy): IsoDate | null {
  for (const night of eachNight(checkIn, checkOut)) {
    if (roomsFreeOnNight(night, rooms, o) === 0) return night;
  }
  return null;
}
