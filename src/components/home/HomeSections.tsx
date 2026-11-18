import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { rooms } from "@/data/rooms";
import { extras } from "@/data/extras";
import { reviews } from "@/data/reviews";
import { useBookingDraft } from "@/context/BookingDraftContext";
import { whatsappLink } from "@/lib/messages";
import { money } from "@/lib/utils";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { ZoomImage } from "./ZoomImage";
import { SectionHeading } from "./SectionHeading";
import { RoomDialog } from "@/components/booking/RoomDialog";
import { Star } from "lucide-react";

export function QuickFacts() {
  const facts = [
    { title: "500 m", text: "to Kachcheri station" },
    { title: "Garden & terrace", text: "morning tea outside" },
    { title: "Jaffna breakfast", text: "homemade, loved by guests" },
    { title: "Pets welcome", text: "Sophie says hello" },
  ];
  return (
    <section className="container pb-10">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {facts.map((f) => (
          <li key={f.title} className="card p-3">
            <div className="font-extrabold">{f.title}</div>
            <div className="text-sm text-muted">{f.text}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HostSection() {
  return (
    <section className="bg-white py-12">
      <div className="container grid gap-6 md:grid-cols-2 md:items-center">
        <div className="grid grid-cols-2 gap-3">
          <PhotoPlaceholder label="Sophie in the garden" src="/images/sophie-garden.webp" className="h-40 w-full md:h-64" />
          <PhotoPlaceholder label="Sophie taking a rest" src="/images/sophie-resting.webp" className="h-40 w-full md:h-64" tone="gold" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Meet your hosts</span>
          <h2 className="text-3xl text-garden-dark">Vanakkam! I'm Tony.</h2>
          <p className="leading-relaxed">
            I know my country and Jaffna very well, and I love helping guests plan their days: Delft Island, the northern
            coast, the best places to eat. Sophie, my golden retriever, will probably meet you at the gate.
          </p>
          <p className="leading-relaxed">Our rooms are simple, clean and good value. Come as a guest, leave as a friend.</p>
        </div>
      </div>
    </section>
  );
}

export function RoomsSection() {
  const { dispatch } = useBookingDraft();
  const navigate = useNavigate();
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const detailsRoom = rooms.find((r) => r.id === detailsId);
  const closeDetails = useCallback(() => setDetailsId(null), []);
  const choose = (roomId: string) => {
    dispatch({ type: "setRoom", roomId });
    navigate("/book");
  };
  return (
    <section id="rooms" className="container scroll-mt-20 py-12">
      <SectionHeading eyebrow="Stay" title="Rooms" />
      <p className="mt-2 text-muted">Every room has a kitchenette, dining table and its own entrance. Prices per room per night.</p>
      <ul className="mt-6 grid gap-3 lg:grid-cols-2">
        {rooms.map((r) => (
          <li key={r.id} className="card flex items-center justify-between gap-3 p-4">
            {r.image && (
              <button type="button" onClick={() => setDetailsId(r.id)} aria-label={`See ${r.name} photo and details`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <img src={r.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            )}
            <div className="min-w-0 flex-1 text-left">
              <h3 className="font-sans text-base font-extrabold">{r.name}</h3>
              <p className="text-sm text-muted">
                {r.beds}
                {r.airCon ? " · AC" : ""}
              </p>
              <p className="text-xs font-bold text-garden-dark">{r.bathroom === "private" ? "Private bathroom" : "Shared bathroom"}</p>
              <button type="button" onClick={() => setDetailsId(r.id)} className="mt-1 min-h-[32px] text-sm font-bold text-garden-dark underline underline-offset-4">
                Details
              </button>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-sm text-muted">
                from <strong className="text-lg text-bark">{money(r.nightlyPrice)}</strong>
              </span>
              <button type="button" onClick={() => choose(r.id)} className="btn-outline rounded-full text-sm" aria-label={`Choose ${r.name}`}>
                Choose
              </button>
            </div>
          </li>
        ))}
      </ul>
      {detailsRoom && <RoomDialog room={detailsRoom} onClose={closeDetails} onChoose={() => choose(detailsRoom.id)} chooseLabel="Choose this room and pick dates" />}
    </section>
  );
}

export function ExperiencesSection() {
  return (
    <section id="experiences" className="scroll-mt-20 bg-garden-dark py-12 text-cream">
      <div className="container">
        <SectionHeading eyebrow="Experiences" title="Jaffna with Tony" light />
        <p className="mt-2 text-[#E4EDE2]">Add these when you book, or ask Tony when you arrive.</p>
        <ul className="mt-6 grid gap-3 lg:grid-cols-2">
          {extras.map((x) => (
            <li key={x.id} className="flex items-center justify-between gap-3 rounded-xl border border-cream/20 bg-cream/5 px-4 py-3">
              <div>
                <div className="font-extrabold">{x.name}</div>
                <div className="text-sm text-[#D5E2D2]">{x.description}</div>
              </div>
              <span className="shrink-0 font-extrabold text-[#F2C66D]">
                {money(x.price)}
                {x.pricing === "per_unit_per_night" ? "/day" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="container py-12">
      <SectionHeading eyebrow="Reviews" title="What guests say" />
      <ul className="mt-3 flex flex-wrap gap-2">
        {site.categoryScores.map((c) => (
          <li key={c.label} className="rounded-full border border-line bg-white px-3 py-1 text-sm font-bold">
            {c.label} {c.score.toFixed(1)}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {reviews.map((r, i) => {
          const featured = i === 0;
          return (
            <figure
              key={r.author}
              className={
                featured
                  ? "relative overflow-hidden rounded-2xl bg-garden-dark p-6 text-cream md:col-span-2 md:p-8"
                  : "card relative p-5"
              }
            >
              <span aria-hidden="true" className={`absolute right-4 top-1 font-display text-8xl leading-none ${featured ? "text-cream/15" : "text-garden/10"}`}>
                &rdquo;
              </span>
              <div className="flex gap-0.5 text-[#F2C66D]" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className={`relative mt-3 font-display leading-snug ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-extrabold ${featured ? "bg-cream text-garden-dark" : "bg-garden-soft text-garden-dark"}`}
                >
                  {r.author[0]}
                </span>
                <span className="flex flex-col text-sm">
                  <strong>{r.author}</strong>
                  <span className={featured ? "text-[#D5E2D2]" : "text-muted"}>{r.country} · via Booking.com</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export function LocationSection() {
  return (
    <section className="bg-white py-12">
      <div className="container grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <SectionHeading eyebrow="Location" title="Find us" />
          <iframe
            title={`Map: ${site.address}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent("Tony's Garden House, " + site.address)}&output=embed`}
            loading="lazy"
            className="h-56 w-full rounded-2xl border-0"
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Tony's Garden House, " + site.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-garden-dark"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" /> {site.address} · Open in Google Maps
          </a>
          <ul className="list-disc pl-5 leading-7">
            {site.distances.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl text-garden-dark">Good to know</h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Check-in", site.rules.checkIn],
              ["Check-out", site.rules.checkOut],
              ["Gate closes", site.rules.gateCloses],
              ["Guests", `Ages ${site.rules.ageRange}`],
              ["Quiet hours", site.rules.quietHours],
              ["Pets", site.rules.pets],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-cream p-3">
                <dt className="font-extrabold">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const link = whatsappLink(site.whatsappNumber, "Vanakkam Tony! I have a question about staying at your guesthouse.");
  return (
    <section className="container flex flex-col items-center gap-3 py-12 text-center">
      <h2 className="text-3xl text-garden-dark">Talk to Tony</h2>
      <a href={link} target="_blank" rel="noreferrer" className="btn-garden w-full max-w-sm">
        <MessageCircle className="h-5 w-5" aria-hidden="true" /> Message Tony on WhatsApp
      </a>
      <p className="text-sm text-muted">{site.phone} · English &amp; Tamil</p>
      <Link to="/book" className="font-bold">Or book your room now</Link>
    </section>
  );
}

export function GallerySection() {
  const photos = [
    { src: "/images/garden.webp", label: "The garden with mango trees", big: true },
    { src: "/images/garden-hut.webp", label: "Thatched garden hut" },
    { src: "/images/breakfast.webp", label: "Homemade Jaffna breakfast" },
    { src: "/images/room-blue.webp", label: "Room with air conditioning", big: true },
    { src: "/images/room-twin.webp", label: "Twin room" },
    { src: "/images/room-triple.webp", label: "Triple room" },
    { src: "/images/room-green.webp", label: "Bright guest room" },
    { src: "/images/lounge.webp", label: "Lounge and reception" },
    { src: "/images/dining.webp", label: "Dining area" },
    { src: "/images/kitchen.webp", label: "Guest kitchen" },
    { src: "/images/bathroom.webp", label: "Clean bathroom" },
    { src: "/images/room-yellow-triple.webp", label: "Room with three beds" },
    { src: "/images/room-green-double.webp", label: "Quiet green room" },
    { src: "/images/exterior-dusk.webp", label: "Entrance and sign" },
  ];
  return (
    <section className="container py-10">
      <SectionHeading eyebrow="Photos" title="A look around" className="mb-5" />
      <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 [grid-auto-flow:dense] md:auto-rows-[10rem] md:grid-cols-4">
        {photos.map((p) => (
          <PhotoPlaceholder
            key={p.src}
            src={p.src}
            label={p.label}
            className={p.big ? "col-span-2 row-span-2 h-full w-full" : "h-full w-full"}
          />
        ))}
      </div>
    </section>
  );
}

export function GuestWall() {
  return (
    <section className="container pb-12">
      <figure className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line md:grid md:grid-cols-[3fr_2fr] md:items-center">
        {/* Each tile's width follows its photo's shape, so nothing is cropped. */}
        <div className="flex aspect-[1.75/1] gap-0.5 md:aspect-[3.29/1]">
          <ZoomImage src="/images/guest-signing.webp" alt="A guest writing a message on the guest wall" className="h-full min-w-0 rounded-none" style={{ flex: "1 1 0" }} />
          <ZoomImage src="/images/guest-drawing-tony.webp" alt="A guest's drawing of Tony with the words Thank you" className="h-full min-w-0 rounded-none" style={{ flex: "0.75 1 0" }} />
          <ZoomImage src="/images/guest-drawing-dragon.webp" alt="A dragon drawn by guests from Austria" className="hidden h-full min-w-0 rounded-none md:block" style={{ flex: "1.54 1 0" }} />
        </div>
        <figcaption className="flex flex-col justify-center gap-1.5 p-4 md:p-6">
          <span className="eyebrow">Our guest wall</span>
          <p className="font-display text-xl leading-snug text-garden-dark">Every traveller leaves a note.</p>
          <p className="text-muted">
            Messages and drawings from guests all over the world. Come and add yours.
          </p>
        </figcaption>
      </figure>
    </section>
  );
}
