import { useSyncExternalStore } from "react";
import type { Block, Booking } from "@/types/booking";
import { demoBlocks, demoBookings } from "@/data/demoBookings";
import { todayIso } from "./dates";

/**
 * Prototype data store: bookings and imported blocks in localStorage.
 * Every screen reads through this one module, so swapping it for the real
 * backend (Supabase, see docs/ARCHITECTURE.md) changes nothing else.
 */

interface StoreState {
  bookings: Booking[];
  blocks: Block[];
}

const KEY = "tgh.store.v1";
const listeners = new Set<() => void>();

function seed(): StoreState {
  const today = todayIso();
  return { bookings: demoBookings(today), blocks: demoBlocks(today) };
}

function load(): StoreState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {
    /* storage blocked or corrupt: fall back to demo data */
  }
  return seed();
}

let state: StoreState = typeof window === "undefined" ? seed() : load();

function save(next: StoreState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: keep in memory only */
  }
  listeners.forEach((l) => l());
}

export const bookingStore = {
  get: (): StoreState => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  addBooking(b: Booking) {
    save({ ...state, bookings: [...state.bookings, b] });
  },
  markPaid(ref: string) {
    save({
      ...state,
      bookings: state.bookings.map((b) => (b.ref === ref ? { ...b, paid: true, status: "confirmed" } : b)),
    });
  },
  cancel(ref: string) {
    save({ ...state, bookings: state.bookings.map((b) => (b.ref === ref ? { ...b, status: "cancelled" } : b)) });
  },
  replaceBlocks(roomId: string, source: Block["source"], blocks: Block[]) {
    const kept = state.blocks.filter((bl) => !(bl.roomId === roomId && bl.source === source));
    save({ ...state, blocks: [...kept, ...blocks] });
  },
  resetDemo() {
    save(seed());
  },
  find(ref: string): Booking | undefined {
    return state.bookings.find((b) => b.ref === ref);
  },
};

export function useStore(): StoreState {
  return useSyncExternalStore(bookingStore.subscribe, bookingStore.get, bookingStore.get);
}
