/** Short, readable booking reference, e.g. "TGH-4K7Q". No 0/O or 1/I to avoid mix-ups on the phone. */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function newBookingRef(random: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < 4; i++) code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return `TGH-${code}`;
}
