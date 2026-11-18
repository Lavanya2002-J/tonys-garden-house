import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Phone-only floating "Book" bar that appears once the visitor scrolls past the top of the page. */
export function StickyBook() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!show}
    >
      <Link to="/book" tabIndex={show ? 0 : -1} className="btn-primary min-h-[52px] w-full text-base">
        <CalendarCheck className="h-5 w-5" aria-hidden="true" /> Book direct with Tony
      </Link>
    </div>
  );
}
