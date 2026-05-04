import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: string | number | undefined) {
  const amount = Number(value || 0);

  return `Rs. ${new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount)}`;
}

export function stripHtml(value: string | undefined) {
  return (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function productImageAlt(name: string, alt?: string) {
  return alt?.trim() || `${name} product image`;
}
