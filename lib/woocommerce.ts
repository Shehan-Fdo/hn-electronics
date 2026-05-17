import { ProductQuery, WCCategory, WCProduct } from "@/types/woocommerce";

// Server-only env vars — NOT prefixed with NEXT_PUBLIC_
const baseUrl = process.env.WC_BASE_URL ?? process.env.NEXT_PUBLIC_WC_BASE_URL;
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}) {
  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error("WooCommerce environment variables are not configured.");
  }

  // Normalize slashes: remove trailing from base, ensure leading on path
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = "/" + path.replace(/^\/+/, "");
  const url = new URL(`${cleanBase}${cleanPath}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function buildAuthHeader(): string {
  // Basic auth keeps credentials out of URL query params (and therefore out of server logs)
  const encoded = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  return `Basic ${encoded}`;
}

function getWcOrigin() {
  if (!baseUrl) return "";
  try {
    return new URL(baseUrl).origin;
  } catch {
    return "";
  }
}

async function wcFetch<T>(path: string, params?: Record<string, string | number | undefined>) {
  const url = buildUrl(path, params);
  const isProduction = process.env.NODE_ENV === "production";
  
  const response = await fetch(url, {
    headers: { Authorization: buildAuthHeader() },
    ...(isProduction ? { next: { revalidate: 1800 } } : { cache: "no-store" })
  });

  if (!response.ok) {
    throw new Error(`WooCommerce request failed: ${response.status} at ${url}`);
  }

  const text = await response.text();
  const origin = getWcOrigin();
  
  if (origin) {
    const escapedOrigin = origin.replace(/\//g, "\\/");
    const replaced = text
      .split(origin + "/wp-content/").join("/wp-content/")
      .split(escapedOrigin + "\\/wp-content\\/").join("\\/wp-content\\/");
    return JSON.parse(replaced) as T;
  }

  return JSON.parse(text) as T;
}

export function getProducts(params: ProductQuery = {}) {
  return wcFetch<WCProduct[]>("/products", {
    per_page: params.per_page ?? 20,
    page: params.page ?? 1,
    category: params.category,
    search: params.search
  });
}

export function getProduct(id: number | string) {
  return wcFetch<WCProduct>(`/products/${id}`);
}

export async function getCategories(): Promise<WCCategory[]> {
  const perPage = 100; // WC REST API max per page
  const results: WCCategory[] = [];
  let page = 1;

  while (true) {
    const batch = await wcFetch<WCCategory[]>("/products/categories", {
      per_page: perPage,
      page,
      hide_empty: "true"
    });
    results.push(...batch);
    // If we got fewer items than requested, we've reached the last page
    if (batch.length < perPage) break;
    page++;
  }

  return results;
}

export async function getCategoryBySlug(slug?: string, categories?: WCCategory[]) {
  if (!slug) return undefined;
  // Reuse pre-fetched list when available to avoid a redundant API call
  const list = categories ?? (await getCategories());
  return list.find((category) => category.slug === slug);
}
