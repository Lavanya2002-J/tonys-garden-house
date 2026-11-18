import type { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { CalendarDays, Home, List } from "lucide-react";
import { useAdminLang } from "@/context/AdminLangContext";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/layout/Logo";

/**
 * Tony's screens: built for his phone first (bottom navigation, big buttons,
 * English or Tamil). No login in this prototype; see docs/ARCHITECTURE.md.
 */
export function AdminLayout({ title, subtitle, children, header }: { title: string; subtitle?: string; children: ReactNode; header?: ReactNode }) {
  const { lang, setLang, t } = useAdminLang();
  const nav = [
    { to: "/admin", label: t.navToday, icon: Home, end: true },
    { to: "/admin/bookings", label: t.navBookings, icon: List, end: false },
    { to: "/admin/calendar", label: t.navCalendar, icon: CalendarDays, end: false },
  ];
  return (
    <div lang={lang} className="flex min-h-screen flex-col bg-cream">
      <header className="relative overflow-hidden bg-garden-dark text-cream">
        <img src="/images/exterior.webp" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-garden-dark/40 to-garden-dark/90" />
        <div className="relative mx-auto flex max-w-2xl flex-col gap-3 px-4 pb-4 pt-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3" aria-label="Open the guest website">
              <LogoMark size={32} />
              <span className="flex flex-col">
                <span className="font-display text-xl font-bold">{title}</span>
                {subtitle && <span className="text-sm text-[#D5E2D2]">{subtitle}</span>}
              </span>
            </Link>
            <div role="group" aria-label="Language" className="flex rounded-full bg-cream/10 p-1">
              {(["en", "ta"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={cn("min-h-[44px] min-w-[52px] rounded-full px-3 text-sm font-extrabold", lang === l ? "bg-cream text-garden-dark" : "text-cream")}
                >
                  {l === "en" ? "EN" : "தமிழ்"}
                </button>
              ))}
            </div>
          </div>
          {header}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-4 pb-28 pt-4">{children}</main>
      <nav aria-label="Admin" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white">
        <ul className="mx-auto grid max-w-2xl grid-cols-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn("flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-bold", isActive ? "text-garden-dark" : "text-muted")
                }
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
