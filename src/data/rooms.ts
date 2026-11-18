import type { Room } from "@/types/booking";

/**
 * Room types are from Tony's Booking.com listing.
 * PLACEHOLDER: prices, and bathroom/AC for Budget Twin, Economy Triple and
 * Standard Double (the listing does not say). Confirm with Tony.
 * PLACEHOLDER: room photos are illustrative; match each to its real room.
 */
export const rooms: Room[] = [
  { id: "budget-twin", name: "Budget Twin", beds: "1 single + 1 double bed", bathroom: "shared", airCon: false, capacity: 2, nightlyPrice: 15, image: "/images/room-twin.webp" },
  { id: "double-shared", name: "Double Room", beds: "1 double bed", bathroom: "shared", airCon: false, capacity: 2, nightlyPrice: 17, image: "/images/room-ornate.webp" },
  { id: "basic-triple", name: "Basic Triple", beds: "1 single + 1 double bed", bathroom: "shared", airCon: false, capacity: 3, nightlyPrice: 19, image: "/images/room-yellow.webp" },
  { id: "economy-triple", name: "Economy Triple", beds: "1 single + 1 double bed", bathroom: "shared", airCon: false, capacity: 3, nightlyPrice: 20, image: "/images/room-mint.webp" },
  { id: "triple-shared", name: "Triple Room", beds: "1 single + 1 double bed", bathroom: "shared", airCon: true, capacity: 3, nightlyPrice: 21, image: "/images/room-triple.webp" },
  { id: "standard-double", name: "Standard Double", beds: "1 double bed", bathroom: "private", airCon: true, capacity: 2, nightlyPrice: 22, image: "/images/room-blue.webp" },
  { id: "triple-private", name: "Triple Room Plus", beds: "2 singles + 1 large double bed", bathroom: "private", airCon: true, capacity: 3, nightlyPrice: 28, image: "/images/room-teal.webp" },
];

export const MAX_GUESTS = Math.max(...rooms.map((r) => r.capacity));

export function getRoom(id: string | null | undefined): Room | undefined {
  return rooms.find((r) => r.id === id);
}
