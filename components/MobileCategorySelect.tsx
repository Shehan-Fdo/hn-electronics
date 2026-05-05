"use client";

import { useRouter } from "next/navigation";
import { WCCategory } from "@/types/woocommerce";

export function MobileCategorySelect({
  categories,
  activeCategorySlug
}: {
  categories: WCCategory[];
  activeCategorySlug?: string;
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
          <option key={category.id} value={category.slug}>
            {category.name} ({category.count})
          </option>
        ))}
      </select>
    </div>
  );
}
