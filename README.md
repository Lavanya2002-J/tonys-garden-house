# Tony's Garden House: website + direct booking system

Guest website, 5-step direct booking flow and Tony's phone admin (English / Tamil)
for Tony's Garden House, Jaffna. Same stack as our booking-system prototype:
Vite, React 18, TypeScript, Tailwind, React Router.

## Run it

```sh
npm install
npm run dev        # http://localhost:8080
npm test           # unit tests (pricing, availability, iCal, day sheet, messages)
npm run build      # type-check + production build into dist/
```

| URL | What it is |
| --- | --- |
| `/` | Guest website: Tony & Sophie, rooms, experiences, reviews, location, house rules |
| `/book` | Direct booking: Dates → Room → Extras → Details → Pay |
| `/booking/:ref` | Confirmation with "What happens next" and the automatic guest message |
| `/admin` | Tony's Today screen: arrivals, departures, money to collect, what to prepare |
| `/admin/bookings` | All bookings, upcoming and past, with Mark paid |
| `/admin/calendar` | iCal export/import with Booking.com and Airbnb (one calendar) |

This is a **prototype**: bookings are stored in the browser (localStorage) with demo
data built around today's date. Reset it from `/admin/calendar` → "Reset demo data".
There is no login on `/admin` yet.

## Before showing Tony / going live

Everything Tony might change is in `src/config/site.ts`, `src/data/rooms.ts` and
`src/data/extras.ts`. Lines marked `PLACEHOLDER` must be confirmed with him:

- Room prices, and bathroom/AC for Budget Twin, Economy Triple, Standard Double
- Breakfast and extra prices, and the "book direct" perk
- Bank details (`[BANK NAME]` etc.); keep real account details out of git
- Directions text in `src/lib/messages.ts`
- Real photos (components show labelled placeholders) and review permission

Facts marked `SOURCE` (rating 9.7 / 499 reviews, room types, rules, address,
distances) come from Tony's public Booking.com listing, November 2026.

See `docs/ARCHITECTURE.md` for how it is built and the plan to a real backend.
