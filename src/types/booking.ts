/** ISO calendar date, "YYYY-MM-DD". Kept as a string so time zones never shift a stay. */
export type IsoDate = string;

export type BathroomType = "shared" | "private";

export interface Room {
  id: string;
  name: string;
  beds: string;
  bathroom: BathroomType;
  airCon: boolean;
  /** Most guests the room sleeps. */
  capacity: number;
  /** Price per room per night, USD. */
  nightlyPrice: number;
  /** Optional photo path under /public. */
  image?: string;
}

export type ExtraPricing = "per_person" | "per_unit_per_night" | "per_booking";

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  pricing: ExtraPricing;
  /** Upper limit per booking; null = up to the number of guests. */
  maxQty: number | null;
}

export type PaymentMethod = "bank_transfer" | "cash_on_arrival";

export type BookingSource = "direct" | "booking_com" | "airbnb" | "hostelworld" | "walk_in";

export type BookingStatus =
  | "awaiting_payment" // direct + bank transfer, waiting for Tony to see the money
  | "confirmed"        // paid, or cash on arrival agreed
  | "cancelled";

export interface GuestDetails {
  fullName: string;
  whatsapp: string;
  email: string;
  country: string;
  arrivalWindow: string;
  note: string;
}

/** What the guest is building in the booking flow (nothing saved yet). */
export interface BookingDraft {
  checkIn: IsoDate | null;
  checkOut: IsoDate | null;
  guests: number;
  roomId: string | null;
  breakfast: boolean;
  extras: Record<string, number>;
  guest: GuestDetails;
  houseRulesAccepted: boolean;
  paymentMethod: PaymentMethod;
}

export interface QuoteLine {
  label: string;
  amount: number;
  kind: "room" | "breakfast" | "discount" | "extra";
}

export interface Quote {
  nights: number;
  lines: QuoteLine[];
  total: number;
}

/** A saved booking, from any channel. */
export interface Booking {
  ref: string;
  roomId: string;
  checkIn: IsoDate;
  checkOut: IsoDate;
  guests: number;
  source: BookingSource;
  status: BookingStatus;
  paymentMethod: PaymentMethod | "paid_on_channel";
  paid: boolean;
  total: number;
  guest: GuestDetails;
  breakfast: boolean;
  extras: Record<string, number>;
  createdAt: string;
}

/** A night blocked by another channel's calendar (iCal import) or by Tony. */
export interface Block {
  id: string;
  roomId: string;
  start: IsoDate;
  end: IsoDate; // exclusive, like a check-out date
  source: BookingSource | "manual";
  label: string;
}
