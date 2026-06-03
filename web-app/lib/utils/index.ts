import { clsx, type ClassValue } from "clsx";

/**
 * Merges class names using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
