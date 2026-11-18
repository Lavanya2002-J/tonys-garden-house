import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import { HeroCarousel } from "./HeroCarousel";

export function Hero() {
  return (
    <section className="container grid gap-8 py-8 md:grid-cols-2 md:items-center md:py-14">
      <HeroCarousel className="h-64 w-full md:order-2 md:h-[420px]" />
      <div className="flex flex-col gap-4">
        <span className="flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5">
          <span className="rounded-lg bg-garden-dark px-2 py-0.5 text-sm font-extrabold text-white">{site.rating.score}</span>
          <span className="text-sm font-bold">
            {site.rating.label} · {site.rating.count} reviews
          </span>
        </span>
        <h1 className="text-4xl font-bold leading-[1.05] text-garden-dark md:text-5xl lg:text-6xl">{site.tagline}</h1>
        <p className="max-w-prose text-lg leading-relaxed">
          A simple, clean guesthouse with a garden in the heart of Jaffna. No luxury, just a warm home, a homemade Jaffna
          breakfast and a friend who knows every corner of the north.
        </p>
        <Link to="/book" className="btn-primary min-h-[54px] text-lg md:w-fit md:px-8">
          Book direct with Tony
        </Link>
        <p className="flex items-start gap-2.5 rounded-xl bg-garden-soft px-4 py-3 text-sm">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-garden-dark" aria-hidden="true" />
          <span>
            <strong>{site.directPerk.text}</strong> Same rooms, same Tony, no booking-site fees.
          </span>
        </p>
      </div>
    </section>
  );
}
