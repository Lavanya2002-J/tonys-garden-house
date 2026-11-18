import { describe, expect, it } from "vitest";
import { addDays, eachNight, monthGrid, nightsBetween, overlaps, shortDate } from "@/lib/dates";
import { quote, maxExtraQty, commissionSaved } from "@/lib/pricing";
import { availableRooms, firstFullNight, isRoomFree, roomsFreeOnNight } from "@/lib/availability";
import { exportRoomCalendar, importCalendar } from "@/lib/ical";
import { daySheet, needsPayment } from "@/lib/today";
import { guestConfirmationMessage, whatsappLink } from "@/lib/messages";
import { newBookingRef } from "@/lib/bookingRef";
import { draftReducer, initialDraft } from "@/context/BookingDraftContext";
import { rooms, getRoom } from "@/data/rooms";
import { extras } from "@/data/extras";
import { demoBlocks, demoBookings } from "@/data/demoBookings";
import { site } from "@/config/site";
import type { Booking } from "@/types/booking";

const T = "2026-12-15";

function booking(over: Partial<Booking>): Booking {
  return {
    ref: "TGH-TEST", roomId: "budget-twin", checkIn: T, checkOut: addDays(T, 2), guests: 2,
    source: "direct", status: "confirmed", paymentMethod: "bank_transfer", paid: false, total: 30,
    guest: { fullName: "Ana Silva", whatsapp: "+351 900 000 000", email: "", country: "Portugal", arrivalWindow: "14:00 to 17:00", note: "" },
    breakfast: false, extras: {}, createdAt: "2026-12-01T00:00:00Z", ...over,
  };
}

describe("dates", () => {
  it("counts nights and lists each night", () => {
    expect(nightsBetween("2026-12-30", "2027-01-02")).toBe(3);
    expect(eachNight("2026-12-30", "2027-01-02")).toEqual(["2026-12-30", "2026-12-31", "2027-01-01"]);
  });
  it("treats a check-out day as free for the next guest", () => {
    expect(overlaps("2026-12-15", "2026-12-17", "2026-12-17", "2026-12-19")).toBe(false);
    expect(overlaps("2026-12-15", "2026-12-18", "2026-12-17", "2026-12-19")).toBe(true);
  });
  it("formats and builds a Monday-first month", () => {
    expect(shortDate("2026-12-15")).toBe("Tue 15 Dec");
    const grid = monthGrid(2026, 11); // December 2026 starts on a Tuesday
    expect(grid[0]).toBeNull();
    expect(grid[1]).toBe("2026-12-01");
  });
});

describe("pricing", () => {
  const room = getRoom("standard-double");
  it("prices room, breakfast with the direct perk, and extras", () => {
    const q = quote({ room, nights: 3, guests: 2, breakfast: true, extras: { "cooking-class": 2, bicycle: 1, pickup: 1 }, catalog: extras, breakfastPricePerGuest: 4, freeBreakfastMornings: 1 });
    // 22*3 + 4*2*3 - 4*2 + 15*2 + 3*1*3 + 12
    expect(q.total).toBe(66 + 24 - 8 + 30 + 9 + 12);
    expect(q.lines.find((l) => l.kind === "discount")?.amount).toBe(-8);
  });
  it("is zero with no room and no nights", () => {
    expect(quote({ room: undefined, nights: 0, guests: 2, breakfast: true, extras: {}, catalog: extras, breakfastPricePerGuest: 4, freeBreakfastMornings: 1 }).total).toBe(0);
  });
  it("limits extras sensibly", () => {
    expect(maxExtraQty(extras.find((x) => x.id === "pickup")!, 3)).toBe(1);
    expect(maxExtraQty(extras.find((x) => x.id === "delft-trip")!, 3)).toBe(3);
    expect(commissionSaved(100)).toBe(15);
  });
});

describe("availability", () => {
  const o = { bookings: [booking({ roomId: "budget-twin" })], blocks: [] };
  it("blocks a booked room and frees it on check-out day", () => {
    expect(isRoomFree("budget-twin", T, addDays(T, 1), o)).toBe(false);
    expect(isRoomFree("budget-twin", addDays(T, 2), addDays(T, 3), o)).toBe(true);
  });
  it("ignores cancelled bookings", () => {
    const c = { bookings: [booking({ status: "cancelled" })], blocks: [] };
    expect(isRoomFree("budget-twin", T, addDays(T, 1), c)).toBe(true);
  });
  it("filters by party size and finds a fully booked night", () => {
    expect(availableRooms(rooms, 3, T, addDays(T, 1), o).every((r) => r.capacity >= 3)).toBe(true);
    const full = { bookings: [], blocks: demoBlocks(T) };
    expect(roomsFreeOnNight(addDays(T, 10), rooms, full)).toBe(0);
    expect(firstFullNight(rooms, addDays(T, 8), addDays(T, 13), full)).toBe(addDays(T, 10));
  });
  it("demo bookings never double-book a room", () => {
    const list = demoBookings(T);
    for (const a of list) for (const b of list) {
      if (a !== b && a.roomId === b.roomId) expect(overlaps(a.checkIn, a.checkOut, b.checkIn, b.checkOut)).toBe(false);
    }
  });
});

describe("iCal sync", () => {
  it("round-trips our bookings through export and import", () => {
    const ics = exportRoomCalendar("budget-twin", "Budget Twin", [booking({})]);
    expect(ics).toContain("DTSTART;VALUE=DATE:20261215");
    const blocks = importCalendar(ics, "budget-twin", "booking_com");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ start: T, end: addDays(T, 2) });
  });
  it("skips broken events", () => {
    expect(importCalendar("BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:x\nEND:VEVENT\nEND:VCALENDAR", "x", "airbnb")).toEqual([]);
  });
});

describe("Tony's day sheet", () => {
  it("lists arrivals, departures and money to collect", () => {
    const sheet = daySheet(T, rooms, { bookings: demoBookings(T), blocks: [] });
    expect(sheet.arrivals.map((b) => b.ref).sort()).toEqual(["TGH-K5JS", "TGH-L3NA", "TGH-P8RA"]);
    expect(sheet.departures).toHaveLength(2);
    expect(sheet.toCollect).toBe(70 + 160); // bank transfer pending + cash on arrival; Booking.com paid there
    expect(sheet.pickups.map((b) => b.ref)).toEqual(["TGH-L3NA"]);
  });
  it("does not ask for money already paid on another site", () => {
    expect(needsPayment(booking({ paymentMethod: "paid_on_channel", paid: true }))).toBe(false);
    expect(needsPayment(booking({ paid: false }))).toBe(true);
  });
});

describe("messages and refs", () => {
  it("writes the bank transfer message Tony used to type", () => {
    const msg = guestConfirmationMessage(booking({ total: 82 }), getRoom("budget-twin"), site);
    expect(msg).toContain("Vanakkam Ana!");
    expect(msg).toContain("$82");
    expect(msg).toContain(site.bank.accountNumber);
  });
  it("builds a WhatsApp link with digits only", () => {
    expect(whatsappLink("+94 77 033 9879", "hi")).toBe("https://wa.me/94770339879?text=hi");
  });
  it("makes readable refs", () => {
    expect(newBookingRef(() => 0)).toBe("TGH-2222");
    expect(newBookingRef()).toMatch(/^TGH-[2-9A-Z]{4}$/);
  });
});

describe("date picking in the booking form", () => {
  it("first tap is check-in, second is check-out, an earlier tap restarts", () => {
    let d = draftReducer(initialDraft, { type: "pickDate", date: "2026-12-20" });
    d = draftReducer(d, { type: "pickDate", date: "2026-12-23" });
    expect([d.checkIn, d.checkOut]).toEqual(["2026-12-20", "2026-12-23"]);
    d = draftReducer(d, { type: "pickDate", date: "2026-12-18" });
    expect([d.checkIn, d.checkOut]).toEqual(["2026-12-18", null]);
  });
});
