import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminLang } from "@/context/AdminLangContext";
import { bookingStore, useStore } from "@/lib/bookingStore";
import { exportRoomCalendar, importCalendar } from "@/lib/ical";
import { rooms } from "@/data/rooms";
import { shortDate } from "@/lib/dates";

/**
 * Prototype of "One calendar". Export: Tony gives Booking.com/Airbnb each room's
 * .ics link so they close nights booked here. Import: paste their .ics to close
 * nights booked there. In production both run on a schedule from the server
 * (fetching the channel's iCal URL), with no copy-paste.
 */
export default function CalendarSyncPage() {
  const { t } = useAdminLang();
  const { bookings, blocks } = useStore();
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [ics, setIcs] = useState("");
  const [message, setMessage] = useState("");
  const room = rooms.find((r) => r.id === roomId)!;

  const exportHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(exportRoomCalendar(room.id, room.name, bookings))}`;
  const roomBlocks = blocks.filter((b) => b.roomId === roomId);

  function doImport() {
    const imported = importCalendar(ics, roomId, "booking_com");
    bookingStore.replaceBlocks(roomId, "booking_com", imported);
    setMessage(`${imported.length} booked periods imported for ${room.name}.`);
    setIcs("");
  }

  return (
    <AdminLayout title={t.calendarTitle}>
      <label className="flex flex-col gap-1.5 font-bold">
        Room
        <select className="field" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>

      <section className="card flex flex-col gap-2 p-4">
        <h2 className="font-sans text-base font-extrabold">Export to Booking.com / Airbnb</h2>
        <p className="text-sm text-muted">Bookings made on the website, as a calendar file these sites can read.</p>
        <a className="btn-outline w-fit" href={exportHref} download={`${room.id}.ics`}>
          <Download className="h-4 w-4" aria-hidden="true" /> Download {room.name}.ics
        </a>
      </section>

      <section className="card flex flex-col gap-2 p-4">
        <h2 className="font-sans text-base font-extrabold">Import from Booking.com</h2>
        <label className="flex flex-col gap-1.5 text-sm font-bold">
          Paste the room's .ics calendar
          <textarea className="field min-h-[120px] py-2 font-mono text-xs" value={ics} onChange={(e) => setIcs(e.target.value)} placeholder="BEGIN:VCALENDAR…" />
        </label>
        <button type="button" className="btn-garden w-fit" disabled={!ics.includes("BEGIN:VEVENT")} onClick={doImport}>
          <Upload className="h-4 w-4" aria-hidden="true" /> Import
        </button>
        {message && <p role="status" className="text-sm font-bold text-garden-dark">{message}</p>}
      </section>

      <section className="card flex flex-col gap-2 p-4">
        <h2 className="font-sans text-base font-extrabold">Closed from other sites</h2>
        {roomBlocks.length === 0 ? (
          <p className="text-sm text-muted">None for this room.</p>
        ) : (
          <ul className="text-sm">
            {roomBlocks.map((bl) => (
              <li key={bl.id} className="flex justify-between gap-3 border-b border-line py-2 last:border-0">
                <span>{shortDate(bl.start)} → {shortDate(bl.end)}</span>
                <span className="text-muted">{bl.label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="mt-4 text-sm font-bold text-muted underline" onClick={() => bookingStore.resetDemo()}>
        {t.resetDemo}
      </button>
    </AdminLayout>
  );
}
