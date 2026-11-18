import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import type { BookingDraft, GuestDetails, IsoDate, PaymentMethod } from "@/types/booking";
import { site } from "@/config/site";

/**
 * The booking the guest is building. Lives above the routes so the
 * Rooms "Choose" button on the home page can pre-select a room.
 */

const emptyGuest: GuestDetails = {
  fullName: "",
  whatsapp: "",
  email: "",
  country: "",
  arrivalWindow: site.arrivalWindows[1],
  note: "",
};

export const initialDraft: BookingDraft = {
  checkIn: null,
  checkOut: null,
  guests: 2,
  roomId: null,
  breakfast: true,
  extras: {},
  guest: emptyGuest,
  houseRulesAccepted: false,
  paymentMethod: site.payments.bankTransfer ? "bank_transfer" : "cash_on_arrival",
};

type Action =
  | { type: "pickDate"; date: IsoDate }
  | { type: "clearDates" }
  | { type: "setGuests"; guests: number }
  | { type: "setRoom"; roomId: string | null }
  | { type: "toggleBreakfast" }
  | { type: "setExtra"; id: string; qty: number }
  | { type: "setGuest"; patch: Partial<GuestDetails> }
  | { type: "toggleRules" }
  | { type: "setPayment"; method: PaymentMethod }
  | { type: "reset" };

/**
 * Date picking, like most booking sites: first tap = check-in, second tap
 * after it = check-out, a tap on or before check-in starts again.
 */
export function draftReducer(d: BookingDraft, a: Action): BookingDraft {
  switch (a.type) {
    case "pickDate": {
      if (!d.checkIn || d.checkOut || a.date <= d.checkIn) return { ...d, checkIn: a.date, checkOut: null };
      return { ...d, checkOut: a.date };
    }
    case "clearDates":
      return { ...d, checkIn: null, checkOut: null, roomId: null };
    case "setGuests":
      return { ...d, guests: a.guests };
    case "setRoom":
      return { ...d, roomId: a.roomId };
    case "toggleBreakfast":
      return { ...d, breakfast: !d.breakfast };
    case "setExtra":
      return { ...d, extras: { ...d.extras, [a.id]: a.qty } };
    case "setGuest":
      return { ...d, guest: { ...d.guest, ...a.patch } };
    case "toggleRules":
      return { ...d, houseRulesAccepted: !d.houseRulesAccepted };
    case "setPayment":
      return { ...d, paymentMethod: a.method };
    case "reset":
      return initialDraft;
  }
}

interface Ctx {
  draft: BookingDraft;
  dispatch: Dispatch<Action>;
}

const BookingDraftContext = createContext<Ctx | null>(null);

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, dispatch] = useReducer(draftReducer, initialDraft);
  const value = useMemo(() => ({ draft, dispatch }), [draft]);
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft(): Ctx {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error("useBookingDraft must be used inside BookingDraftProvider");
  return ctx;
}
