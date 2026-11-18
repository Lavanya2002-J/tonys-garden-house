# Architecture

## What we kept from our booking-system prototype (UI.zip)

| Pattern in UI.zip | Here |
| --- | --- |
| Numbered booking steps with ticks; finished steps can be tapped to edit (`BookingSteps.tsx`) | `components/booking/BookingSteps.tsx` |
| Two columns on wide screens with a sticky summary sidebar; single column with a sticky bottom CTA on phones (`CheckoutPage.tsx`) | `pages/BookPage.tsx` |
| Payment choice cards: pay now / pay on arrival / invoice (`PaymentOptionsPage.tsx`) | Bank transfer before arrival / Cash on arrival, switchable in `config/site.ts` |
| "What happens next" card on confirmation, one variant per payment path (`WhatsNextCard.tsx`) | `components/booking/WhatsNextCard.tsx` |
| Overnight / multi-day bookings, instant confirmation | Check-in / check-out range, confirmed instantly; bank transfer marked "awaiting payment" |
| Pure, tested rule modules (`lib/contactAccess.ts`, `lib/tablePlan/engine.ts`) | `lib/pricing.ts`, `lib/availability.ts`, `lib/today.ts`, `lib/ical.ts`, `lib/messages.ts` |
| Staff Day Operations run sheet: arrivals desk, money outstanding, add-ons to prepare | `pages/admin/TodayPage.tsx` |
| Demo data with stable IDs, one store all screens read | `data/demoBookings.ts`, `lib/bookingStore.ts` |

Left out on purpose (not needed by a 7-room guesthouse): governance, permits,
insurance, seasons, POS, memberships, multi-venue search.

## Folders

```
src/
  config/site.ts          Tony's settings: rules, perk, bank, payment options
  data/                   rooms, extras, reviews, demo bookings
  types/booking.ts        Room, Extra, BookingDraft, Booking, Block, Quote
  lib/                    pure logic (tested) + the data store
    pricing.ts            one price calculation for every screen
    availability.ts       is a room free, rooms free per night, first full night
    today.ts              Tony's day sheet
    ical.ts               export/import .ics for Booking.com and Airbnb
    messages.ts           guest confirmation, payment received, arrival guide, wa.me links
    bookingStore.ts       localStorage store (swap for the backend)
  context/                booking draft (reducer), admin language
  i18n/admin.ts           English + Tamil for Tony's screens
  components/             layout, home, booking, admin
  pages/                  Home, Book, Confirmation, admin/*
```

Rule: components never compute prices or availability themselves; they call `lib/`.
That keeps the guest's total, the confirmation message and Tony's screen in step.

## Booking flow

1. **Dates**: calendar shows rooms free per night; full nights are crossed out but can be a check-out day.
2. **Room**: rooms too small or already booked are disabled with the reason.
3. **Extras**: breakfast (first morning free when booked direct), tours, bike hire, pickup.
4. **Details**: name, WhatsApp and/or email, arrival window, house-rules checkbox.
5. **Pay**: bank transfer or cash; the room is re-checked just before saving.

Then `/booking/:ref` shows the guest message Tony used to type by hand.

## From prototype to live (suggested)

| Phase | Work |
| --- | --- |
| 1 | Supabase (same as UI.zip) using `supabase/schema.sql`; replace `bookingStore` with API calls; Tony login (magic link to his phone/email); send confirmation email; host on Netlify/Vercel with Tony's domain |
| 2 | Server job every 15 min: fetch each room's Booking.com/Airbnb iCal URL → `blocks`; publish our `.ics` per room; 7am WhatsApp summary to Tony (WhatsApp Business API or a scheduled email to start) |
| 3 | Seasonal prices, long-stay rates, Nallur festival page, partner referrals, card payments (e.g. PayHere) |

Double-booking safety in production: insert a booking inside a transaction that
checks `bookings` and `blocks` for overlaps (see the exclusion constraint in the schema).
