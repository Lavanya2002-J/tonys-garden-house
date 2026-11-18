import type { Booking, Room } from "@/types/booking";
import type { SiteConfig } from "@/config/site";
import { nightsBetween, shortDate } from "./dates";
import { money, plural } from "./utils";

/**
 * Messages the system sends instead of Tony typing them.
 * Phase 1 opens WhatsApp with the text filled in (wa.me link) and sends email;
 * Phase 2 can send through the WhatsApp Business API.
 */

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "friend";
}

export function stayLine(b: Pick<Booking, "checkIn" | "checkOut" | "guests">): string {
  const nights = nightsBetween(b.checkIn, b.checkOut);
  return `${shortDate(b.checkIn)} to ${shortDate(b.checkOut)} (${plural(nights, "night", "nights")}, ${plural(b.guests, "guest", "guests")})`;
}

/** Sent to the guest the moment a direct booking is made. */
export function guestConfirmationMessage(b: Booking, room: Room | undefined, site: SiteConfig): string {
  const pay =
    b.paymentMethod === "bank_transfer"
      ? [
          `Please transfer ${money(b.total)} within ${site.bank.transferWithinHours} hours to:`,
          `Bank: ${site.bank.bankName}`,
          `Account: ${site.bank.accountNumber}`,
          `Name: ${site.bank.accountName}`,
          `Reference: ${b.ref}`,
          "Reply here with a photo of the receipt.",
        ].join("\n")
      : `Please bring ${money(b.total)} in cash (or the same in rupees) to pay at check-in.`;

  return [
    `Vanakkam ${firstName(b.guest.fullName)}! Thank you for booking ${site.name}.`,
    "",
    `Booking ${b.ref}: ${room?.name ?? "Room"}, ${stayLine(b)}.`,
    "",
    pay,
    "",
    `We expect you ${b.guest.arrivalWindow}. Check-in ${site.rules.checkIn}, the gate closes at 22:30.`,
    "See you soon!",
    "Tony & Sophie",
  ].join("\n");
}

/** Sent to the guest when Tony taps "Mark paid". */
export function paymentReceivedMessage(b: Booking): string {
  return `Vanakkam ${firstName(b.guest.fullName)}! We received ${money(b.total)} for booking ${b.ref}. Your stay is confirmed. See you on ${shortDate(b.checkIn)}! Tony & Sophie`;
}

/** Sent the day before arrival. */
export function arrivalGuideMessage(b: Booking, site: SiteConfig): string {
  return [
    `Hi ${firstName(b.guest.fullName)}, see you tomorrow at ${site.name}!`,
    `Address: ${site.address}`,
    "Getting here: 500 m from Kachcheri station. [TONY'S DIRECTIONS FROM THE BUS STAND AND RAILWAY STATION]",
    `Check-in ${site.rules.checkIn}. Call or WhatsApp Tony on ${site.phone}.`,
  ].join("\n");
}

/** A wa.me link that opens WhatsApp with the message ready to send. */
export function whatsappLink(phone: string, text: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
