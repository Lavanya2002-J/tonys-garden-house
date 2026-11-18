import { Link } from "react-router-dom";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/messages";

export function SiteFooter() {
  const wa = whatsappLink(site.whatsappNumber, "Vanakkam Tony! I have a question about staying at your guesthouse.");
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.address}`)}`;
  const link = "text-[#E4EDE2] underline-offset-4 hover:text-white hover:underline";
  return (
    <footer className="bg-garden-dark text-[#E4EDE2]">
      <div className="container grid gap-8 py-10 text-sm md:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-xl text-cream">{site.name}</span>
          <span>{site.subTitle}</span>
          <span className="mt-2">Poittu vaanga! See you again.</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="font-extrabold text-cream">Contact Tony</span>
          <a href={wa} target="_blank" rel="noreferrer" className={`${link} flex items-center gap-2`}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={`${link} flex items-center gap-2`}>
            <Phone className="h-4 w-4" aria-hidden="true" /> {site.phone}
          </a>
          <a href={maps} target="_blank" rel="noopener noreferrer" className={`${link} flex items-start gap-2`}>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {site.address}
          </a>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2.5">
          <span className="font-extrabold text-cream">Explore</span>
          <a href="/#rooms" className={link}>Rooms</a>
          <a href="/#experiences" className={link}>Jaffna with Tony</a>
          <a href="/#faq" className={link}>Questions</a>
          <Link to="/book" className={link}>Book your stay</Link>
        </nav>
      </div>
      <div className="border-t border-cream/10">
        <div className="container flex items-center justify-between py-4 text-xs text-[#C9D8C6]">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <Link to="/admin" className="hover:underline">Tony's login</Link>
        </div>
      </div>
    </footer>
  );
}
