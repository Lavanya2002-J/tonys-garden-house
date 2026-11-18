import { Check, MessageCircle } from "lucide-react";
import type { Booking } from "@/types/booking";
import { getRoom } from "@/data/rooms";
import { useAdminLang } from "@/context/AdminLangContext";
import { bookingStore } from "@/lib/bookingStore";
import { needsPayment } from "@/lib/today";
import { nightsBetween, shortDate } from "@/lib/dates";
import { paymentReceivedMessage, whatsappLink } from "@/lib/messages";
import { cn, money } from "@/lib/utils";

/** One guest on Tony's screens: who, which room, where from, and money status. */
export function BookingCard({ b, showDates = false }: { b: Booking; showDates?: boolean }) {
  const { t } = useAdminLang();
  const room = getRoom(b.roomId);
  const nights = nightsBetween(b.checkIn, b.checkOut);
  const direct = b.source === "direct";
  const owes = needsPayment(b);
  const paidHere = b.paid && b.paymentMethod !== "paid_on_channel";

  return (
    <article className="card flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between gap-3">
        {room?.image && <img src={room.image} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />}
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-base font-extrabold">
            {b.guest.fullName}
            {b.guest.country ? ` · ${b.guest.country}` : ""}
          </h3>
          <p className="text-sm text-muted">
            {room?.name} · {nights} {nights === 1 ? t.night : t.nights} · {b.guests} {b.guests === 1 ? t.guest : t.guests}
          </p>
          <p className="text-sm text-muted">
            {showDates ? `${shortDate(b.checkIn)} → ${shortDate(b.checkOut)} · ` : ""}
            {t.arrive} {b.guest.arrivalWindow}
          </p>
          <p className="text-xs text-muted">{b.ref}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-[11px] font-extrabold",
            direct ? "bg-[#DCEADB] text-garden-dark" : "bg-[#EAF0F7] text-[#1E3A5F]",
          )}
        >
          {t.source[b.source]}
        </span>
      </div>

      {owes ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FBF3E2] px-3 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-extrabold">{money(b.total)}</span>
            <span className="text-xs text-muted">{b.paymentMethod === "bank_transfer" ? t.bankWait : t.cashWait}</span>
          </div>
          <button type="button" className="btn-garden min-h-[44px] px-4 text-sm" onClick={() => bookingStore.markPaid(b.ref)}>
            {t.markPaid}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm font-bold text-garden-dark">
            <Check className="h-4 w-4" aria-hidden="true" /> {t.paid}
          </span>
          {paidHere && b.guest.whatsapp && (
            <a
              href={whatsappLink(b.guest.whatsapp, paymentReceivedMessage(b))}
              target="_blank"
              rel="noreferrer"
              className="btn-outline min-h-[40px] text-sm"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> {t.sendWhatsApp}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
