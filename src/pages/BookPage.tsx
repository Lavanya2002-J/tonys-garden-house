import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { StayCalendar } from "@/components/booking/StayCalendar";
import { QtyStepper } from "@/components/booking/QtyStepper";
import { ChoiceCard } from "@/components/booking/ChoiceCard";
import { RoomOption } from "@/components/booking/RoomOption";
import { RoomDialog } from "@/components/booking/RoomDialog";
import { OrderSummary } from "@/components/booking/OrderSummary";
import { useBookingDraft } from "@/context/BookingDraftContext";
import { useStore, bookingStore } from "@/lib/bookingStore";
import { site } from "@/config/site";
import { rooms, getRoom, MAX_GUESTS } from "@/data/rooms";
import { extras } from "@/data/extras";
import { availableRooms, firstFullNight, isRoomFree, roomsFreeOnNight } from "@/lib/availability";
import { nightsBetween, shortDate, todayIso } from "@/lib/dates";
import { maxExtraQty, quote } from "@/lib/pricing";
import { newBookingRef } from "@/lib/bookingRef";
import { stayLine } from "@/lib/messages";
import { money, plural } from "@/lib/utils";
import type { Booking } from "@/types/booking";

const TITLES = ["When are you coming?", "Choose your room", "Make it a Jaffna trip", "Your details", "Review and pay"];

export default function BookPage() {
  const { draft, dispatch } = useBookingDraft();
  const store = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const today = todayIso();

  const occupancy = useMemo(() => ({ bookings: store.bookings, blocks: store.blocks }), [store]);
  const hasRange = !!draft.checkIn && !!draft.checkOut;
  const nights = hasRange ? nightsBetween(draft.checkIn!, draft.checkOut!) : 0;
  const fullNight = hasRange ? firstFullNight(rooms, draft.checkIn!, draft.checkOut!, occupancy) : null;
  const freeRooms = hasRange ? availableRooms(rooms, draft.guests, draft.checkIn!, draft.checkOut!, occupancy) : [];
  const room = getRoom(draft.roomId);
  const detailsRoom = getRoom(detailsId);
  const closeDetails = useCallback(() => setDetailsId(null), []);
  const roomOk = !!room && freeRooms.some((r) => r.id === room.id);

  // Drop a pre-selected room that no longer fits the dates or party size.
  useEffect(() => {
    if (step >= 2 && draft.roomId && hasRange && !roomOk) dispatch({ type: "setRoom", roomId: null });
  }, [step, draft.roomId, hasRange, roomOk, dispatch]);

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const q = quote({
    room: roomOk ? room : undefined,
    nights,
    guests: draft.guests,
    breakfast: draft.breakfast,
    extras: draft.extras,
    catalog: extras,
    breakfastPricePerGuest: site.breakfastPricePerGuest,
    freeBreakfastMornings: site.directPerk.freeBreakfastMornings,
  });

  const g = draft.guest;
  const canContinue =
    (step === 1 && hasRange && !fullNight && freeRooms.length > 0) ||
    (step === 2 && roomOk) ||
    step === 3 ||
    (step === 4 && g.fullName.trim().length > 1 && (g.whatsapp.trim() !== "" || g.email.trim() !== "") && draft.houseRulesAccepted) ||
    step === 5;

  const stay = hasRange ? stayLine({ checkIn: draft.checkIn!, checkOut: draft.checkOut!, guests: draft.guests }) : "";

  function confirm() {
    if (!roomOk || !hasRange) return;
    // Last check: someone may have booked the room while the guest was typing.
    if (!isRoomFree(room!.id, draft.checkIn!, draft.checkOut!, bookingStore.get())) {
      setStep(2);
      return;
    }
    const booking: Booking = {
      ref: newBookingRef(),
      roomId: room!.id,
      checkIn: draft.checkIn!,
      checkOut: draft.checkOut!,
      guests: draft.guests,
      source: "direct",
      status: draft.paymentMethod === "bank_transfer" ? "awaiting_payment" : "confirmed",
      paymentMethod: draft.paymentMethod,
      paid: false,
      total: q.total,
      guest: { ...draft.guest },
      breakfast: draft.breakfast,
      extras: { ...draft.extras },
      createdAt: new Date().toISOString(),
    };
    bookingStore.addBooking(booking);
    dispatch({ type: "reset" });
    navigate(`/booking/${booking.ref}`);
  }

  function next() {
    if (!canContinue) return;
    if (step === 5) confirm();
    else setStep(step + 1);
  }

  const nextLabel = step === 5 ? "Confirm booking" : "Continue";
  const barCaption = step === 1 ? (hasRange ? `${plural(nights, "night", "nights")} · ${plural(draft.guests, "guest", "guests")}` : "Pick your dates") : roomOk ? "Total so far" : "Pick a room";
  const barValue = roomOk ? money(q.total) : hasRange ? shortDate(draft.checkIn!) : "—";

  return (
    <PageLayout footer={false}>
      <BookingSteps current={step} onEdit={setStep} />
      <div className="container grid gap-8 pb-32 pt-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:pb-12">
        <div className="flex min-w-0 flex-col gap-4">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl text-garden-dark outline-none">
            {TITLES[step - 1]}
          </h1>

          {step === 1 && (
            <>
              <StayCalendar
                today={today}
                checkIn={draft.checkIn}
                checkOut={draft.checkOut}
                freeOn={(night) => roomsFreeOnNight(night, rooms, occupancy)}
                onPick={(date) => dispatch({ type: "pickDate", date })}
                onClear={() => dispatch({ type: "clearDates" })}
              />
              <div className="card flex items-center justify-between p-4">
                <div>
                  <div className="font-extrabold">Guests</div>
                  <div className="text-sm text-muted">Ages {site.rules.ageRange}</div>
                </div>
                <QtyStepper value={draft.guests} min={1} max={MAX_GUESTS} onChange={(n) => dispatch({ type: "setGuests", guests: n })} label="guests" />
              </div>
              {hasRange && !fullNight && freeRooms.length > 0 && (
                <p className="rounded-xl bg-garden-soft px-4 py-3 text-sm">
                  <strong>{stay}</strong>
                  <br />
                  {plural(freeRooms.length, "room", "rooms")} free for these dates.
                </p>
              )}
              {hasRange && (fullNight || freeRooms.length === 0) && (
                <p role="alert" className="rounded-xl border border-[#E7B9A6] bg-clay-soft px-4 py-3 text-sm text-clay">
                  {fullNight
                    ? `Tony is full on ${shortDate(fullNight)}. Pick other dates or a shorter stay.`
                    : `No room for ${plural(draft.guests, "guest", "guests")} on these dates. Try fewer guests or other dates.`}
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-muted">{stay}</p>
              <div className="flex flex-col gap-3">
                {rooms.map((r) => {
                  const fits = r.capacity >= draft.guests;
                  const free = freeRooms.some((f) => f.id === r.id);
                  const note = !fits ? `Fits ${r.capacity} guests` : !free ? "Booked for these dates" : r.bathroom === "private" ? "Private bathroom" : "Shared bathroom";
                  return (
                    <RoomOption
                      key={r.id}
                      room={r}
                      note={note}
                      nights={nights}
                      selected={draft.roomId === r.id && fits && free}
                      disabled={!fits || !free}
                      onSelect={() => dispatch({ type: "setRoom", roomId: r.id })}
                      onDetails={() => setDetailsId(r.id)}
                    />
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-muted">Optional. Tony prepares these before you arrive.</p>
              <ChoiceCard
                selected={draft.breakfast}
                onSelect={() => dispatch({ type: "toggleBreakfast" })}
                title="Homemade Jaffna breakfast"
                description={`${money(site.breakfastPricePerGuest)} per guest per morning · first morning free when you book direct`}
              />
              {extras.map((x) => (
                <div key={x.id} className="card flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="font-extrabold">{x.name}</div>
                    <div className="text-sm text-muted">
                      {money(x.price)} {x.pricing === "per_person" ? "per person" : x.pricing === "per_unit_per_night" ? "per bike per day" : "one way"}
                    </div>
                  </div>
                  <QtyStepper
                    value={draft.extras[x.id] ?? 0}
                    min={0}
                    max={maxExtraQty(x, draft.guests)}
                    onChange={(n) => dispatch({ type: "setExtra", id: x.id, qty: n })}
                    label={x.name}
                  />
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); next(); }}>
              <p className="text-muted">Tony sends your confirmation, payment details and directions here.</p>
              <label className="flex flex-col gap-1.5 font-bold">
                Full name
                <input className="field" autoComplete="name" value={g.fullName} onChange={(e) => dispatch({ type: "setGuest", patch: { fullName: e.target.value } })} placeholder="As on your passport" required />
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                WhatsApp number
                <input className="field" type="tel" autoComplete="tel" value={g.whatsapp} onChange={(e) => dispatch({ type: "setGuest", patch: { whatsapp: e.target.value } })} placeholder="+44 7700 900123" />
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Email
                <input className="field" type="email" autoComplete="email" value={g.email} onChange={(e) => dispatch({ type: "setGuest", patch: { email: e.target.value } })} placeholder="you@example.com" />
              </label>
              <p className="-mt-2 text-xs text-muted">Give a WhatsApp number or an email, or both.</p>
              <label className="flex flex-col gap-1.5 font-bold">
                Country
                <input className="field" autoComplete="country-name" value={g.country} onChange={(e) => dispatch({ type: "setGuest", patch: { country: e.target.value } })} />
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Arrival time
                <select className="field" value={g.arrivalWindow} onChange={(e) => dispatch({ type: "setGuest", patch: { arrivalWindow: e.target.value } })}>
                  {site.arrivalWindows.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 font-bold">
                Anything Tony should know? (optional)
                <textarea className="field min-h-[96px] py-2" value={g.note} onChange={(e) => dispatch({ type: "setGuest", patch: { note: e.target.value } })} />
              </label>
              <label className="card flex items-start gap-3 p-4 text-sm">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--garden))]" checked={draft.houseRulesAccepted} onChange={() => dispatch({ type: "toggleRules" })} />
                <span>
                  I've read the house rules: check-in {site.rules.checkIn}, gate closes at 22:30, guests aged {site.rules.ageRange}, quiet from 22:00.
                </span>
              </label>
              <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
            </form>
          )}

          {step === 5 && (
            <>
              <OrderSummary room={roomOk ? room : undefined} stay={stay} quote={q} className="lg:hidden" />
              <h2 className="mt-2 font-sans text-base font-extrabold">How would you like to pay?</h2>
              {site.payments.bankTransfer && (
                <ChoiceCard
                  selected={draft.paymentMethod === "bank_transfer"}
                  onSelect={() => dispatch({ type: "setPayment", method: "bank_transfer" })}
                  title="Bank transfer before arrival"
                  description="Bank details arrive on WhatsApp and email straight away."
                />
              )}
              {site.payments.cashOnArrival && (
                <ChoiceCard
                  selected={draft.paymentMethod === "cash_on_arrival"}
                  onSelect={() => dispatch({ type: "setPayment", method: "cash_on_arrival" })}
                  title="Cash on arrival"
                  description="Pay Tony at check-in."
                />
              )}
            </>
          )}
        </div>

        {/* Sticky summary sidebar on wide screens */}
        <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-3">
          <OrderSummary room={roomOk ? room : undefined} stay={stay} quote={q} />
          <button type="button" className="btn-primary w-full" disabled={!canContinue} onClick={next}>
            {nextLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          {step > 1 && (
            <button type="button" className="text-sm font-bold text-garden-dark" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
        </aside>
      </div>

      {/* Sticky bottom bar on phones and tablets */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="container flex items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-xs text-muted">{barCaption}</span>
            <span className="text-xl font-extrabold">{barValue}</span>
          </div>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button type="button" className="min-h-[48px] px-3 font-bold text-garden-dark" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button type="button" className="btn-primary" disabled={!canContinue} onClick={next}>
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
      {detailsRoom && (
        <RoomDialog
          room={detailsRoom}
          onClose={closeDetails}
          onChoose={
            hasRange && detailsRoom.capacity >= draft.guests && freeRooms.some((r) => r.id === detailsRoom.id)
              ? () => {
                  dispatch({ type: "setRoom", roomId: detailsRoom.id });
                  closeDetails();
                }
              : undefined
          }
        />
      )}
    </PageLayout>
  );
}
