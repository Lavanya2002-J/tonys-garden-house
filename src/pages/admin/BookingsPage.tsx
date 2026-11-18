import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BookingCard } from "@/components/admin/BookingCard";
import { useAdminLang } from "@/context/AdminLangContext";
import { useStore } from "@/lib/bookingStore";
import { todayIso } from "@/lib/dates";
import { cn } from "@/lib/utils";

export default function BookingsPage() {
  const { t } = useAdminLang();
  const { bookings } = useStore();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const today = todayIso();

  const list = bookings
    .filter((b) => b.status !== "cancelled")
    .filter((b) => (tab === "upcoming" ? b.checkOut >= today : b.checkOut < today))
    .sort((a, b) => (tab === "upcoming" ? a.checkIn.localeCompare(b.checkIn) : b.checkIn.localeCompare(a.checkIn)));

  return (
    <AdminLayout title={t.allBookings}>
      <div role="tablist" aria-label={t.allBookings} className="grid grid-cols-2 gap-1 rounded-xl bg-sand p-1">
        {(["upcoming", "past"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn("min-h-[44px] rounded-lg font-extrabold", tab === k ? "bg-white text-garden-dark" : "text-muted")}
          >
            {k === "upcoming" ? t.upcoming : t.past}
          </button>
        ))}
      </div>
      {list.map((b) => (
        <BookingCard key={b.ref} b={b} showDates />
      ))}
    </AdminLayout>
  );
}
