import type { PaymentMethod } from "@/types/booking";
import { site } from "@/config/site";

const STEPS: Record<PaymentMethod, string[]> = {
  bank_transfer: [
    "Bank details are on your WhatsApp and email now.",
    `Transfer within ${site.bank.transferWithinHours} hours and send the receipt. Tony confirms with one tap.`,
    "The day before you arrive you get directions, Tony's number and the check-in guide.",
  ],
  cash_on_arrival: [
    "Your confirmation is on your WhatsApp and email now.",
    "Pay Tony in cash when you check in.",
    "The day before you arrive you get directions, Tony's number and the check-in guide.",
  ],
};

export function WhatsNextCard({ method }: { method: PaymentMethod }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[#CFE0CB] bg-garden-soft p-4">
      <h2 className="font-sans text-base font-extrabold">What happens next</h2>
      <ol className="flex flex-col gap-2.5">
        {STEPS[method].map((text, i) => (
          <li key={text} className="flex items-start gap-2.5 text-sm leading-relaxed">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-garden text-xs font-extrabold text-white">{i + 1}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
