import { useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BookingCard } from "@/components/admin/BookingCard";
import { useAdminLang } from "@/context/AdminLangContext";
import { useStore } from "@/lib/bookingStore";
import { daySheet } from "@/lib/today";
import { fromIso, todayIso } from "@/lib/dates";
import { rooms, getRoom } from "@/data/rooms";
import { extras } from "@/data/extras";
import { money } from "@/lib/utils";

function longDate(iso: string, lang: "en" | "ta"): string {
  return fromIso(iso).toLocaleDateString(lang === "ta" ? "ta-LK" : "en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}

export default function TodayPage() {
  const { t, lang } = useAdminLang();
  const store = useStore();
  const today = todayIso();
  const sheet = useMemo(() => daySheet(today, rooms, { bookings: store.bookings, blocks: store.blocks }), [today, store]);

  // Extras guests arriving today asked for, so Tony can prepare.
  const prep: { what: string; key: string }[] = [];
  if (sheet.breakfastGuests > 0) prep.push({ key: "breakfast", what: `${t.breakfastFor} ${sheet.breakfastGuests} ${t.people}` });
  for (const b of sheet.arrivals) {
    for (const x of extras) {
      const qty = b.extras[x.id] ?? 0;
      if (qty > 0) prep.push({ key: `${b.ref}-${x.id}`, what: `${x.name} × ${qty} · ${b.guest.fullName}` });
    }
  }

  const tiles = [
    { label: t.arriving, value: String(sheet.arrivals.length) },
    { label: t.leaving, value: String(sheet.departures.length) },
    { label: t.freeTonight, value: `${sheet.freeTonight} / ${sheet.totalRooms}` },
  ];

  return (
    <AdminLayout
      title={t.hello}
      subtitle={longDate(today, lang)}
      header={
        <div className="grid grid-cols-2 gap-2">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-xl bg-cream/10 px-3 py-2.5">
              <div className="text-2xl font-extrabold">{tile.value}</div>
              <div className="text-xs text-[#D5E2D2]">{tile.label}</div>
            </div>
          ))}
          <div className="rounded-xl bg-sophie px-3 py-2.5 text-sophie-ink">
            <div className="text-2xl font-extrabold">{money(sheet.toCollect)}</div>
            <div className="text-xs font-bold">{t.toCollect}</div>
          </div>
        </div>
      }
    >
      <img src="/images/exterior.webp" alt="Tony's Garden House" className="h-32 w-full rounded-2xl object-cover" />

      <h2 className="font-sans text-base font-extrabold">{t.arrivals}</h2>
      {sheet.arrivals.length === 0 && <p className="text-sm text-muted">{t.noArrivals}</p>}
      {sheet.arrivals.map((b) => (
        <BookingCard key={b.ref} b={b} />
      ))}

      <h2 className="mt-3 font-sans text-base font-extrabold">{t.departures}</h2>
      {sheet.departures.length === 0 ? (
        <p className="text-sm text-muted">{t.noDepartures}</p>
      ) : (
        <ul className="card divide-y divide-line px-4">
          {sheet.departures.map((b) => (
            <li key={b.ref} className="flex items-center gap-3 py-3 text-sm">
              {getRoom(b.roomId)?.image && <img src={getRoom(b.roomId)!.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover" />}
              <span className="flex-1 font-bold">{b.guest.fullName}</span>
              <span className="text-muted">{getRoom(b.roomId)?.name}</span>
            </li>
          ))}
        </ul>
      )}

      {prep.length > 0 && (
        <>
          <h2 className="mt-3 font-sans text-base font-extrabold">{t.prepare}</h2>
          <ul className="flex flex-col gap-2">
            {prep.map((p) => (
              <li key={p.key} className="card px-4 py-3 text-sm font-bold">{p.what}</li>
            ))}
          </ul>
        </>
      )}

      <section className="mt-3 rounded-2xl border border-[#CFE0CB] bg-garden-soft p-4">
        <h2 className="font-sans text-sm font-extrabold">{t.sync}</h2>
        <p className="mt-1 text-sm">Booking.com · Airbnb · Hostelworld · Website</p>
        <p className="mt-1 text-xs text-muted">{t.syncNote}</p>
      </section>

      <section className="card flex items-center justify-between p-4">
        <div>
          <div className="text-xs text-muted">{t.directThisMonth}</div>
          <div className="text-lg font-extrabold">{sheet.directThisMonth}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted">{t.commissionSaved}</div>
          <div className="text-lg font-extrabold text-garden-dark">≈ {money(Math.round(sheet.commissionSavedThisMonth))}</div>
        </div>
      </section>
    </AdminLayout>
  );
}
