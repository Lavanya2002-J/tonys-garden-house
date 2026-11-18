import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BookingDraftProvider } from "@/context/BookingDraftContext";
import { AdminLangProvider } from "@/context/AdminLangContext";
import HomePage from "@/pages/HomePage";
import BookPage from "@/pages/BookPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import TodayPage from "@/pages/admin/TodayPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import CalendarSyncPage from "@/pages/admin/CalendarSyncPage";
import NotFound from "@/pages/NotFound";

/**
 * Guest side:  /  →  /book (5 steps)  →  /booking/:ref
 * Tony's side: /admin (Today) · /admin/bookings · /admin/calendar
 */
export default function App() {
  return (
    <BrowserRouter>
      <BookingDraftProvider>
        <AdminLangProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/booking/:ref" element={<ConfirmationPage />} />
            <Route path="/admin" element={<TodayPage />} />
            <Route path="/admin/bookings" element={<BookingsPage />} />
            <Route path="/admin/calendar" element={<CalendarSyncPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLangProvider>
      </BookingDraftProvider>
    </BrowserRouter>
  );
}
