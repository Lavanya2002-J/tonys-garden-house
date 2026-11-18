import type { IsoDate } from "@/types/booking";

/**
 * Date helpers on plain "YYYY-MM-DD" strings, computed in UTC so a stay
 * never moves a day because of the viewer's time zone.
 */

export function toIso(d: Date): IsoDate {
  return d.toISOString().slice(0, 10);
}

export function fromIso(iso: IsoDate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function todayIso(now: Date = new Date()): IsoDate {
  return toIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const d = fromIso(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

/** Nights between check-in and check-out (check-out exclusive). */
export function nightsBetween(checkIn: IsoDate, checkOut: IsoDate): number {
  return Math.round((fromIso(checkOut).getTime() - fromIso(checkIn).getTime()) / 86_400_000);
}

/** Every night of a stay: check-in up to, not including, check-out. */
export function eachNight(checkIn: IsoDate, checkOut: IsoDate): IsoDate[] {
  const out: IsoDate[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Two half-open ranges [aStart, aEnd) and [bStart, bEnd) share a night. */
export function overlaps(aStart: IsoDate, aEnd: IsoDate, bStart: IsoDate, bEnd: IsoDate): boolean {
  return aStart < bEnd && bStart < aEnd;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Thu 17 Dec" */
export function shortDate(iso: IsoDate): string {
  const d = fromIso(iso);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** "December 2026" */
export function monthTitle(year: number, monthIndex: number): string {
  return `${MONTHS_LONG[monthIndex]} ${year}`;
}

/** Monday-first grid of a month: leading nulls pad the first week. */
export function monthGrid(year: number, monthIndex: number): (IsoDate | null)[] {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: (IsoDate | null)[] = Array(lead).fill(null);
  for (let day = 1; day <= days; day++) cells.push(toIso(new Date(Date.UTC(year, monthIndex, day))));
  return cells;
}
