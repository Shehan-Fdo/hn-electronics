"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types/api";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function CategoryFilterClient({
  categories,
  counts = {},
}: {
  categories: Category[];
  counts?: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Local state for instant visual feedback before router navigation completes
  const [optimisticSlugs, setOptimisticSlugs] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || []
  );

  // Sync state if URL changes externally (e.g., back button)
  useEffect(() => {
    setOptimisticSlugs(searchParams.get("category")?.split(",").filter(Boolean) || []);
  }, [searchParams]);

  const toggleCategory = (slug: string) => {
    const current = new Set(optimisticSlugs);
    if (current.has(slug)) {
      current.delete(slug);
    } else {
      current.add(slug);
    }

    const newSlugs = Array.from(current);
    setOptimisticSlugs(newSlugs); // Update UI instantly

    const params = new URLSearchParams(searchParams.toString());
    if (newSlugs.length > 0) {
      params.set("category", newSlugs.join(","));
    } else {
      params.delete("category");
    }
    
    // reset pagination if it exists
    params.delete("page");

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    setOptimisticSlugs([]); // Update UI instantly
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      {/* Mobile Dropdown Toggle */}
      <div className="lg:hidden relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm text-left outline-none focus:border-ink flex items-center justify-between"
        >
          <span>{optimisticSlugs.length === 0 ? "All products" : `${optimisticSlugs.length} Categories Selected`}</span>
          <span className="text-xs">▼</span>
        </button>
        
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full rounded border border-line bg-white shadow-lg max-h-64 overflow-y-auto">
             <button 
                onClick={() => { clearAll(); setDropdownOpen(false); }}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm hover:bg-neutral-50",
                  optimisticSlugs.length === 0 && "bg-neutral-50 font-medium"
                )}
              >
                All products
              </button>
            {categories.map((c) => (
              <label key={c._id} className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={optimisticSlugs.includes(c.slug)}
                  onChange={() => toggleCategory(c.slug)}
                  className="rounded border-line accent-ink"
                />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs opacity-70">{counts[c._id] || 0}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Desktop List */}
      <div className="hidden lg:grid gap-1 mt-4">
        <button
          onClick={clearAll}
          className={cn(
            "rounded px-3 py-2 text-sm text-left hover:bg-neutral-100",
            optimisticSlugs.length === 0 && "bg-ink text-white hover:bg-ink"
          )}
        >
          All products
        </button>
        {categories.map((category) => {
          const isSelected = optimisticSlugs.includes(category.slug);
          return (
            <label
              key={category._id}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer",
                isSelected && "bg-neutral-100 font-medium"
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCategory(category.slug)}
                className="rounded border-line accent-ink"
              />
              <span className="flex-1 truncate">{category.name}</span>
              <span className="text-xs opacity-70">{counts[category._id] || 0}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
