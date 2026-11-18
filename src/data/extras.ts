import type { Extra } from "@/types/booking";

/** Extras Tony already offers (Booking.com listing). PLACEHOLDER prices. */
export const extras: Extra[] = [
  { id: "cooking-class", name: "Jaffna cooking class", description: "Cook crab curry and pittu with a local family", price: 15, pricing: "per_person", maxQty: null },
  { id: "delft-trip", name: "Delft Island day trip", description: "Ferry, wild ponies and the old Dutch fort", price: 25, pricing: "per_person", maxQty: null },
  { id: "north-tour", name: "Northern coast tour", description: "Point Pedro, Keerimalai and the lagoons", price: 30, pricing: "per_person", maxQty: null },
  { id: "bicycle", name: "Bicycle hire", description: "Explore the peninsula at your own pace", price: 3, pricing: "per_unit_per_night", maxQty: null },
  { id: "pickup", name: "Airport or bus pickup", description: "Tony meets you on arrival", price: 12, pricing: "per_booking", maxQty: 1 },
];

export function getExtra(id: string): Extra | undefined {
  return extras.find((e) => e.id === id);
}
