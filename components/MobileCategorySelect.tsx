"use client";

import { useRouter } from "next/navigation";
import { Category } from "@/types/api";

export function MobileCategorySelect({
  categories,
  activeCategorySlug,
  counts = {}
}: {
  categories: Category[];
  activeCategorySlug?: string;
  counts?: Record<string, number>;
}) {
  const router = useRouter();

  return (
    <div className="mt-4 lg:hidden">
      <select
        className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        value={activeCategorySlug || ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            router.push(`/shop?category=${val}`);
          } else {
            router.push(`/shop`);
          }
        }}
      >
        <option value="">All products</option>
        {categories.map((category) => (
          <option key={category._id} value={category.slug}>
            {category.name} ({counts[category._id] || 0})
          </option>
        ))}
      </select>
    </div>
  );
}
