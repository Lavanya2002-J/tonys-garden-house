import type { Block, Booking, BookingSource, IsoDate } from "@/types/booking";

/**
 * "One calendar": Booking.com and Airbnb both export and import iCal (.ics)
 * calendars per room. Export ours so they close nights booked here; import
 * theirs so our site closes nights booked there. Pure functions, no network.
 */

function icsDate(iso: IsoDate): string {
  return iso.replace(/-/g, "");
}

function parseIcsDate(value: string): IsoDate | null {
  const m = value.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** One VCALENDAR for one room: every active booking as an all-day event. */
export function exportRoomCalendar(roomId: string, roomName: string, bookings: Booking[], stamp = "20260101T000000Z"): string {
  const events = bookings
    .filter((b) => b.roomId === roomId && b.status !== "cancelled")
    .map((b) =>
      [
        "BEGIN:VEVENT",
        `UID:${b.ref}@tonysgardenhouse`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${icsDate(b.checkIn)}`,
        `DTEND;VALUE=DATE:${icsDate(b.checkOut)}`,
        "SUMMARY:Booked",
        "END:VEVENT",
      ].join("\r\n"),
    );
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tony's Garden House//Bookings//EN",
    `X-WR-CALNAME:${roomName}`,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Read an .ics file from another channel into blocked nights for one room. */
export function importCalendar(ics: string, roomId: string, source: BookingSource): Block[] {
  const unfolded = ics.replace(/\r?\n[ \t]/g, "");
  const blocks: Block[] = [];
  const events = unfolded.split("BEGIN:VEVENT").slice(1);
  events.forEach((chunk, i) => {
    const body = chunk.split("END:VEVENT")[0];
    const start = body.match(/DTSTART[^:]*:([^\r\n]+)/);
    const end = body.match(/DTEND[^:]*:([^\r\n]+)/);
    const uid = body.match(/UID:([^\r\n]+)/);
    const summary = body.match(/SUMMARY:([^\r\n]+)/);
    const s = start ? parseIcsDate(start[1]) : null;
    const e = end ? parseIcsDate(end[1]) : null;
    if (!s || !e || e <= s) return;
    blocks.push({
      id: `${source}-${roomId}-${uid ? uid[1] : i}`,
      roomId,
      start: s,
      end: e,
      source,
      label: summary ? summary[1] : "Booked elsewhere",
    });
  });
  return blocks;
}
