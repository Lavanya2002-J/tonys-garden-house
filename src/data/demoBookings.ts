import type { Block, Booking, GuestDetails } from "@/types/booking";
import { addDays } from "@/lib/dates";

/**
 * Demo data, built around "today" so Tony's Today screen always has arrivals.
 * Names are made up. Replace with the real backend (docs/ARCHITECTURE.md).
 */

function guest(fullName: string, country: string, arrivalWindow: string): GuestDetails {
  return { fullName, country, arrivalWindow, whatsapp: "", email: "", note: "" };
}

export function demoBookings(today: string): Booking[] {
  const d = (n: number) => addDays(today, n);
  const created = new Date().toISOString();
  return [
    { ref: "TGH-L3NA", roomId: "standard-double", checkIn: d(0), checkOut: d(3), guests: 2, source: "direct", status: "awaiting_payment", paymentMethod: "bank_transfer", paid: false, total: 70, guest: guest("Lena Fischer", "Germany", "14:00 to 17:00"), breakfast: true, extras: { pickup: 1 }, createdAt: created },
    { ref: "TGH-K5JS", roomId: "double-shared", checkIn: d(0), checkOut: d(2), guests: 1, source: "booking_com", status: "confirmed", paymentMethod: "paid_on_channel", paid: true, total: 34, guest: guest("Kenji Sato", "Japan", "17:00 to 20:00"), breakfast: false, extras: {}, createdAt: created },
    { ref: "TGH-P8RA", roomId: "triple-private", checkIn: d(0), checkOut: d(5), guests: 3, source: "direct", status: "confirmed", paymentMethod: "cash_on_arrival", paid: false, total: 160, guest: guest("Priya & Arun Kumar", "Canada", "12:00 to 14:00"), breakfast: true, extras: { "cooking-class": 3 }, createdAt: created },
    { ref: "TGH-T9WK", roomId: "budget-twin", checkIn: d(-3), checkOut: d(0), guests: 2, source: "hostelworld", status: "confirmed", paymentMethod: "paid_on_channel", paid: true, total: 45, guest: guest("Tom Walker", "United Kingdom", "14:00 to 17:00"), breakfast: false, extras: {}, createdAt: created },
    { ref: "TGH-C2RZ", roomId: "basic-triple", checkIn: d(-2), checkOut: d(0), guests: 2, source: "booking_com", status: "confirmed", paymentMethod: "paid_on_channel", paid: true, total: 38, guest: guest("Chiara Rossi", "Italy", "12:00 to 14:00"), breakfast: true, extras: {}, createdAt: created },
    { ref: "TGH-M6DB", roomId: "economy-triple", checkIn: d(-1), checkOut: d(4), guests: 2, source: "airbnb", status: "confirmed", paymentMethod: "paid_on_channel", paid: true, total: 100, guest: guest("Marta Nowak", "Poland", "14:00 to 17:00"), breakfast: true, extras: {}, createdAt: created },
    { ref: "TGH-A4VE", roomId: "triple-shared", checkIn: d(-1), checkOut: d(2), guests: 3, source: "direct", status: "confirmed", paymentMethod: "bank_transfer", paid: true, total: 63, guest: guest("Arjun Mehta", "India", "17:00 to 20:00"), breakfast: false, extras: { "delft-trip": 3 }, createdAt: created },
    { ref: "TGH-S7HN", roomId: "budget-twin", checkIn: d(1), checkOut: d(6), guests: 2, source: "direct", status: "awaiting_payment", paymentMethod: "bank_transfer", paid: false, total: 75, guest: guest("Sofia Lindqvist", "Sweden", "14:00 to 17:00"), breakfast: false, extras: {}, createdAt: created },
  ];
}

/** Nights another channel says are taken (as if imported from Booking.com iCal). */
export function demoBlocks(today: string): Block[] {
  const d = (n: number) => addDays(today, n);
  const all = ["budget-twin", "double-shared", "basic-triple", "economy-triple", "triple-shared", "standard-double", "triple-private"];
  // A full weekend about ten days out, so the calendar shows a "Full" night.
  return all.map((roomId) => ({ id: `demo-${roomId}`, roomId, start: d(10), end: d(12), source: "booking_com", label: "Booked on Booking.com" }));
}
