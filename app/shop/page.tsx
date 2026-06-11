import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBar } from "@/components/SearchBar";
import { SortProducts } from "@/components/SortProducts";
import { MobileCategorySelect } from "@/components/MobileCategorySelect";
import { LinkButton } from "@/components/ui/Button";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse electronics, components, and accessories from HN Electronics."
};

type ShopParams = {
  category?: string;
  search?: string;
  sort?: string;
};

// pageHref function removed since we are using infinite scrolling

export default async function ShopPage({ searchParams }: { searchParams: ShopParams }) {
  const categories = await getCategories();
  const activeCategory = await getCategoryBySlug(searchParams.category, categories);
  
  let sortField = "createdAt";
  let sortOrder: "asc" | "desc" = "desc";
  if (searchParams.sort === "price-asc") {
    sortField = "price";
    sortOrder = "asc";
  } else if (searchParams.sort === "price-desc") {
    sortField = "price";
    sortOrder = "desc";
  }

  const { data: products, facets, totalPages } = await getProducts({
    limit: 20,
    page: 1,
    category: activeCategory?._id,
    search: searchParams.search,
    sort: sortField,
    order: sortOrder
  });

  const categoryCounts: Record<string, number> = {};
  facets?.categories?.forEach((f: any) => {
    categoryCounts[f._id] = f.count;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm uppercase tracking-normal text-muted">Shop</p>
          <h1 className="mt-2 text-4xl font-bold">Products</h1>
          {searchParams.search && (
            <p className="mt-3 text-muted">Results for: &quot;{searchParams.search}&quot;</p>
          )}
        </div>
        <SearchBar defaultValue={searchParams.search} className="md:w-96" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4 self-start lg:sticky lg:top-24">
          <div className="rounded border border-line bg-white p-4">
            <h2 className="font-semibold">Categories</h2>
            <MobileCategorySelect categories={categories} activeCategorySlug={searchParams.category} counts={categoryCounts} />
            <div className="mt-4 hidden lg:grid gap-1">
              <Link
                href="/shop"
                className={cn(
                  "rounded px-3 py-2 text-sm",
                  !searchParams.category && "bg-ink text-white"
                )}
              >
                All products
              </Link>
              {categories.map((category) => {
                const count = facets?.categories?.find((f: any) => f._id === category._id)?.count || 0;
                return (
                  <Link
                    key={category._id}
                    href={`/shop?category=${category.slug}`}
                    className={cn(
                      "flex items-center justify-between rounded px-3 py-2 text-sm hover:bg-neutral-100",
                      searchParams.category === category.slug && "bg-ink text-white hover:bg-ink"
                    )}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Showing {products.length} product{products.length === 1 ? "" : "s"}
              {activeCategory ? ` in ${activeCategory.name}` : ""}
            </p>
          </div>
          <SortProducts 
            initialProducts={products} 
            totalPages={totalPages} 
            searchParams={searchParams} 
            activeCategoryId={activeCategory?._id}
          />
        </section>
      </div>

      <section id="categories" className="mt-20">
        <h2 className="mb-6 text-2xl font-bold">Browse categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard 
              key={category._id} 
              category={category} 
              count={facets?.categories?.find((f: any) => f._id === category._id)?.count || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
