import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// export const API_URL = "http://localhost:3002";
export const API_URL = "http://54.151.192.180:3002";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
