"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Product } from "@/types/api";
import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export function SortProducts({
  initialProducts,
  totalPages,
  searchParams,
  activeCategoryId
}: {
  initialProducts: Product[];
  totalPages: number;
  searchParams: { category?: string; search?: string; sort?: string };
  activeCategoryId?: string;
}) {
  const router = useRouter();
  
  // We need to reset state when searchParams change (since it means a new query)
  // To detect changes, we can track the initialProducts array, but React's easiest way is 
  // relying on Next.js passing new props. We'll use a local state.
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Sync state when new initialProducts come from the server
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setError(false);
  }, [initialProducts]);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && page < totalPages && !loadingMore && !error) {
      loadMore();
    }
  }, [inView, page, totalPages, loadingMore, error]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      
      let sortField = "createdAt";
      let sortOrder: "asc" | "desc" = "desc";
      if (searchParams.sort === "price-asc") {
        sortField = "price";
        sortOrder = "asc";
      } else if (searchParams.sort === "price-desc") {
        sortField = "price";
        sortOrder = "desc";
      }

      const res = await getProducts({
        limit: 20,
        page: nextPage,
        category: activeCategoryId,
        search: searchParams.search,
        sort: sortField,
        order: sortOrder
      });

      // TypeScript knows res is ProductsResponse since we updated getProducts
      const newProducts = 'data' in res ? res.data : (res as any).data || res;
      
      if (Array.isArray(newProducts)) {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more products:", err);
      setError(true);
    } finally {
      setLoadingMore(false);
    }
  }



  function handleSortChange(sortVal: string) {
    const params = new URLSearchParams();
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.search) params.set("search", searchParams.search);
    if (sortVal && sortVal !== "default") params.set("sort", sortVal);
    
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <select
          aria-label="Sort products"
          className="h-11 rounded border border-line bg-white px-3 text-sm outline-none focus:border-ink"
          value={searchParams.sort || "default"}
          onChange={(event) => handleSortChange(event.target.value)}
        >
          <option value="default">Default sort</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </div>
      
      <ProductGrid products={products} />
      
      {page < totalPages && !error && (
        <div ref={ref} className="grid grid-cols-2 gap-x-4 gap-y-10 pt-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="py-10 text-center">
          <p className="mb-4 text-sm text-red-500">Failed to load more products.</p>
          <button 
            onClick={() => setError(false)} 
            className="rounded border border-line bg-white px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
