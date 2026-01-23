import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const strokeColors = [
  { name: "black", hex: "#000000", class: "bg-black" },
  { name: "red", hex: "#EF4444", class: "bg-red-500" },
  { name: "green", hex: "#22C55E", class: "bg-green-500" },
  { name: "blue", hex: "#3B82F6", class: "bg-blue-500" },
  { name: "orange", hex: "#F97316", class: "bg-orange-500" },
];

export const fillColors = [
  { name: "transparent", hex: "#FFFFFF", class: "bg-white" },
  { name: "pink", hex: "#FFC9C9", class: "bg-pink-200" },
  { name: "mint", hex: "#B2F2BB", class: "bg-green-200" },
  { name: "light blue", hex: "#A5D8FF", class: "bg-blue-200" },
  { name: "light yellow", hex: "#FFEFA8", class: "bg-yellow-200" },
];
