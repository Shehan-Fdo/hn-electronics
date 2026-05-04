import { ProductQuery, WCCategory, WCProduct } from "@/types/woocommerce";

const baseUrl = process.env.NEXT_PUBLIC_WC_BASE_URL;
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}) {
  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error("WooCommerce environment variables are not configured.");
  }

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("consumer_key", consumerKey);
  url.searchParams.set("consumer_secret", consumerSecret);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function wcFetch<T>(path: string, params?: Record<string, string | number | undefined>) {
  const isProduction = process.env.NODE_ENV === "production";
  const response = await fetch(buildUrl(path, params), isProduction
    ? {
        next: { revalidate: 1800 }
      }
    : {
        cache: "no-store"
      });

  if (!response.ok) {
    throw new Error(`WooCommerce request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
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

export function getCategories() {
  return wcFetch<WCCategory[]>("/products/categories", {
    per_page: 100,
    hide_empty: "true"
  });
}

export async function getCategoryBySlug(slug?: string) {
  if (!slug) return undefined;
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}
