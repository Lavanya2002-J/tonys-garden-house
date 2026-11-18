/**
 * Everything Tony may want to change without touching components.
 * Facts marked SOURCE come from Tony's public Booking.com listing (Nov 2026).
 * Facts marked PLACEHOLDER must be confirmed with Tony before going live.
 */
export const site = {
  name: "Tony's Garden House",
  tagline: "Stay with Tony & Sophie",
  subTitle: "Backpackers Inn · Jaffna",
  address: "No 215 Old Park Road, Jaffna 40000, Sri Lanka", // SOURCE
  phone: "+94 75 896 1954", // SOURCE (Google Maps)
  whatsappNumber: "94758961954",
  rating: { score: 9.7, label: "Exceptional", count: 499, source: "Booking.com" }, // SOURCE
  categoryScores: [
    { label: "Staff", score: 10.0 },
    { label: "Value", score: 9.8 },
    { label: "Location", score: 9.6 },
    { label: "Cleanliness", score: 9.5 },
  ], // SOURCE
  rules: {
    checkIn: "12:00 to 22:00",
    checkOut: "10:30 to 11:00",
    gateCloses: "22:30 to 06:00",
    quietHours: "22:00 to 06:00",
    ageRange: "18 to 45",
    pets: "Pets welcome, free",
  }, // SOURCE
  distances: [
    "Kachcheri station 500 m",
    "Jaffna railway station 1.3 km",
    "Nallur Kandaswamy temple 2 km",
    "Jaffna Fort 2.6 km",
    "Jaffna airport 15 km",
  ], // SOURCE
  arrivalWindows: ["12:00 to 14:00", "14:00 to 17:00", "17:00 to 20:00", "20:00 to 22:00"],
  directPerk: {
    // PLACEHOLDER: offer to agree with Tony
    text: "Book direct and get a free Jaffna breakfast on your first morning.",
    freeBreakfastMornings: 1,
  },
  breakfastPricePerGuest: 4, // PLACEHOLDER
  currency: "USD",
  bank: {
    // PLACEHOLDER: Tony's real details go here (or in env/backend, never in git if private)
    bankName: "[BANK NAME]",
    accountNumber: "[ACCOUNT NUMBER]",
    accountName: "[ACCOUNT NAME]",
    transferWithinHours: 48,
  },
  payments: {
    bankTransfer: true,
    cashOnArrival: true, // Tony can switch this off
  },
} as const;

export type SiteConfig = typeof site;
