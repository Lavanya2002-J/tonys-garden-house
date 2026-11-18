import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(amount: number): string {
  const sign = amount < 0 ? "−" : "";
  return `${sign}$${Math.abs(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
