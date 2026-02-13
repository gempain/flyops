import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function round(val: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}
