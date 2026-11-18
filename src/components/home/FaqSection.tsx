import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { site } from "@/config/site";
import { extras } from "@/data/extras";
import { money } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function FaqSection() {
  const pickup = extras.find((x) => x.id.includes("airport") || x.name.toLowerCase().includes("pickup"));
  const payWays = [site.payments.bankTransfer && "bank transfer before arrival", site.payments.cashOnArrival && "cash when you arrive"].filter(Boolean).join(" or ");

  const faqs = [
    {
      q: "What time is check-in and check-out?",
      a: `Check-in is ${site.rules.checkIn} and check-out is ${site.rules.checkOut}. Tell Tony your arrival time when you book and he will be ready for you.`,
    },
    {
      q: "Is there a curfew?",
      a: `The gate closes at ${site.rules.gateCloses.split(" to ")[0]} and opens again at ${site.rules.gateCloses.split(" to ")[1]}. Quiet hours are ${site.rules.quietHours}.`,
    },
    {
      q: "Can Tony pick me up from the airport or bus?",
      a: pickup
        ? `Yes. Tony can meet you on arrival for ${money(pickup.price)}. Add it when you book or message him on WhatsApp.`
        : "Yes. Message Tony on WhatsApp with your arrival details.",
    },
    {
      q: "Is breakfast included?",
      a: `Our homemade Jaffna breakfast is optional at ${money(site.breakfastPricePerGuest)} per guest per morning. ${site.directPerk.text}`,
    },
    {
      q: "How do I pay?",
      a: `You can pay by ${payWays}. Booking direct means no booking-site fees.`,
    },
    {
      q: "Are pets allowed?",
      a: `${site.rules.pets}. Sophie, our golden retriever, will probably say hello at the gate.`,
    },
    {
      q: "Who can stay?",
      a: `Our guests are usually aged ${site.rules.ageRange}. Not sure it suits you? Message Tony.`,
    },
    {
      q: "How far are the station and the sights?",
      a: `${site.distances.join(". ")}.`,
    },
  ];

  return (
    <section id="faq" className="container scroll-mt-20 py-12">
      <SectionHeading eyebrow="Good to know" title="Questions guests ask" />
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-extrabold marker:content-none [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-garden-dark transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-4 pb-4 leading-relaxed text-bark">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        Something else? <Link to="/book" className="font-bold text-garden-dark underline-offset-4 hover:underline">Book your room</Link> or message Tony on WhatsApp below.
      </p>
    </section>
  );
}
