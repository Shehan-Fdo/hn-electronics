"use client";

import { useMemo, useState } from "react";
import { WCProduct } from "@/types/woocommerce";
import { ProductGrid } from "@/components/ProductGrid";

export function SortProducts({ products }: { products: WCProduct[] }) {
  const [sort, setSort] = useState("default");
  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === "price-asc") return copy.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price-desc") return copy.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    return copy;
  }, [products, sort]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          aria-label="Sort products"
          className="h-11 rounded border border-line bg-white px-3 text-sm outline-none"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="default">Default sort</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </div>
      <ProductGrid products={sorted} />
    </div>
  );
}
