"use client";

import { Product } from "@/types/api";
import { ProductGrid } from "@/components/ProductGrid";

export function RelatedProducts({
  relatedProducts,
}: {
  relatedProducts: Product[];
}) {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProductGrid products={relatedProducts} />
    </div>
  );
}
