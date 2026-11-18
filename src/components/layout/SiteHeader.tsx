import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="Tony's Garden House home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          <a href="/#rooms" className="hidden px-3 py-2 font-bold text-bark hover:text-garden-dark sm:inline">Rooms</a>
          <a href="/#experiences" className="hidden px-3 py-2 font-bold text-bark hover:text-garden-dark sm:inline">Jaffna with Tony</a>
          <Link to="/book" className="btn-garden min-h-[44px] rounded-full px-5 text-sm">Book</Link>
        </nav>
      </div>
    </header>
  );
}
