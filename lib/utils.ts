import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: string | number | undefined) {
  // Prices from the API are stored in cents without decimals, so divide by 100
  const amount = Number(value || 0) / 100;

  return `Rs. ${new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount)}`;
}

export function stripHtml(value: string | undefined) {
  return (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function productImageAlt(name: string, alt?: string) {
  return alt?.trim() || `${name} product image`;
}

/**
 * Strips dangerous tags and event-handler attributes from HTML strings.
 * Intended for server-side use on WooCommerce product descriptions before
 * passing to dangerouslySetInnerHTML.
 */
export function sanitizeHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    // Remove dangerous block-level tags and their content entirely
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*\/?>/gi, "")
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, "")
    // Strip all on* event handler attributes (onclick, onload, onerror, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    // Strip javascript: href/src values
    .replace(/\s+(href|src)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, "");
}
