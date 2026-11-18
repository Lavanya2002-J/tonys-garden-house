import { Link, useParams } from "react-router-dom";
import { Check, CalendarPlus } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { OrderSummary } from "@/components/booking/OrderSummary";
import { WhatsNextCard } from "@/components/booking/WhatsNextCard";
import { useStore } from "@/lib/bookingStore";
import { getRoom } from "@/data/rooms";
import { extras } from "@/data/extras";
import { site } from "@/config/site";
import { guestConfirmationMessage, stayLine } from "@/lib/messages";
import { nightsBetween } from "@/lib/dates";
import { quote } from "@/lib/pricing";
import type { Booking } from "@/types/booking";

/** A one-event .ics the guest can add to their own calendar. */
function calendarFileHref(b: Booking): string {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tony's Garden House//Guest//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@tonysgardenhouse`,
    `DTSTART;VALUE=DATE:${b.checkIn.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${b.checkOut.replace(/-/g, "")}`,
    `SUMMARY:Stay at ${site.name} (${b.ref})`,
    `LOCATION:${site.address.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export default function ConfirmationPage() {
  const { ref } = useParams();
  const { bookings } = useStore();
  const b = bookings.find((x) => x.ref === ref);

  if (!b) {
    return (
      <PageLayout>
        <div className="container flex flex-col items-center gap-4 py-20 text-center">
          <h1 className="text-3xl text-garden-dark">Booking not found</h1>
          <p className="text-muted">Check the reference in your message, or contact Tony.</p>
          <Link to="/" className="btn-garden">Back to home</Link>
        </div>
      </PageLayout>
    );
  }

  const room = getRoom(b.roomId);
  const q = quote({
    room,
    nights: nightsBetween(b.checkIn, b.checkOut),
    guests: b.guests,
    breakfast: b.breakfast,
    extras: b.extras,
    catalog: extras,
    breakfastPricePerGuest: site.breakfastPricePerGuest,
    freeBreakfastMornings: site.directPerk.freeBreakfastMornings,
  });
  const first = b.guest.fullName.trim().split(/\s+/)[0];
  const method = b.paymentMethod === "cash_on_arrival" ? "cash_on_arrival" : "bank_transfer";

  return (
    <PageLayout>
      <div className="container grid max-w-5xl gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DCEADB]">
              <Check className="h-8 w-8 text-garden-dark" aria-hidden="true" />
            </span>
            <h1 className="text-3xl text-garden-dark md:text-4xl">You're booked, {first}!</h1>
            <p className="text-muted">
              Booking <strong className="text-bark">{b.ref}</strong> · {room?.name}
            </p>
            <p className="font-bold">{stayLine(b)}</p>
          </div>

          <WhatsNextCard method={method} />

          <section className="flex flex-col gap-2">
            <h2 className="eyebrow font-sans">Sent automatically to your phone and email</h2>
            <div className="max-w-md whitespace-pre-line rounded-[4px_16px_16px_16px] border border-line bg-white p-4 text-sm leading-relaxed">
              {guestConfirmationMessage(b, room, site)}
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={calendarFileHref(b)} download={`${b.ref}.ics`} className="btn-outline">
              <CalendarPlus className="h-5 w-5" aria-hidden="true" /> Add to calendar
            </a>
            <Link to="/" className="btn-garden">Back to Tony's Garden House</Link>
          </div>
        </div>
        <OrderSummary room={room} stay={stayLine(b)} quote={q} />
      </div>
    </PageLayout>
  );
}
