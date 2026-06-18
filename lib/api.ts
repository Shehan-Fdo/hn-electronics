import { ProductQuery, Category, Product } from "@/types/api";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}) {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not configured.");
  }

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

async function apiFetch<T>(path: string, params?: Record<string, string | number | undefined>, options?: RequestInit) {
  const url = buildUrl(path, params);
  const isProduction = process.env.NODE_ENV === "production";
  
  const response = await fetch(url, {
    ...(isProduction ? { next: { revalidate: 60 } } : { cache: "no-store" }),
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} at ${url}`);
  }

  const parsed = await response.json();
  
  // Unwrap standard { success: true, data: ... } or just return the object
  if (parsed && typeof parsed === "object" && "data" in parsed) {
    // Note: GET /api/products returns { data: [], facets: {}, page, total, ... }
    // If it's the products endpoint, we return the whole object, else just data.
    if ("facets" in parsed || "totalPages" in parsed) {
      return parsed as T;
    }
    return parsed.data as T;
  }
  
  return parsed as T;
}

// ---------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------

type ProductsResponse = {
  data: Product[];
  facets: any;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function getProducts(params: ProductQuery = {}) {
  return apiFetch<ProductsResponse>("/products", {
    limit: params.limit ?? 20,
    page: params.page ?? 1,
    category: params.category,
    search: params.search,
    sort: params.sort,
    order: params.order
  });
}

export async function getProduct(slug: string) {
  return apiFetch<Product>(`/products/${slug}`);
}

export async function getRelatedProducts(slug: string, limit: number = 8) {
  return apiFetch<Product[]>(`/products/${slug}/related`, { limit });
}

// ---------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  // Our new API returns categories directly as an array from GET /categories
  return apiFetch<Category[]>("/categories");
}

export async function getSettings() {
  try {
    const res = await fetch(`${baseUrl}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export async function getCategoryBySlug(slug?: string, categories?: Category[]) {
  if (!slug) return undefined;
  const list = categories ?? (await getCategories());
  return list.find((category) => category.slug === slug);
}
