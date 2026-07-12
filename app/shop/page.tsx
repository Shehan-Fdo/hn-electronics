import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBar } from "@/components/SearchBar";
import { SortProducts } from "@/components/SortProducts";
import { CategoryFilterClient } from "@/components/CategoryFilterClient";
import { LinkButton } from "@/components/ui/Button";
import { getCategories, getProducts } from "@/lib/api";
import { cn } from "@/lib/utils";

type ShopParams = {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
};

export async function generateMetadata({ searchParams }: { searchParams: ShopParams }): Promise<Metadata> {
  const canonical = searchParams.category
    ? `/shop?category=${searchParams.category}`
    : "/shop";

  return {
    title: "Shop",
    description: "Browse electronics, components, and accessories from HN Electronics.",
    alternates: {
      canonical,
    }
  };
}

export default async function ShopPage({ searchParams }: { searchParams: ShopParams }) {
  const categories = await getCategories();
  
  const categorySlugs = searchParams.category ? searchParams.category.split(",") : [];
  const activeCategories = categories.filter(c => categorySlugs.includes(c.slug));
  
  let sortField = "createdAt";
  let sortOrder: "asc" | "desc" = "desc";
  if (searchParams.sort === "price-asc") {
    sortField = "price";
    sortOrder = "asc";
  } else if (searchParams.sort === "price-desc") {
    sortField = "price";
    sortOrder = "desc";
  }

  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { data: products, facets, totalPages, total } = await getProducts({
    limit: 20,
    page: isNaN(currentPage) ? 1 : currentPage,
    category: searchParams.category, // Pass comma-separated string natively
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
            <CategoryFilterClient categories={categories} counts={categoryCounts} />
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Showing {total} product{total === 1 ? "" : "s"}
              {activeCategories.length > 0 ? ` in ${activeCategories.map(c => c.name).join(", ")}` : ""}
            </p>
          </div>
          <SortProducts 
            initialProducts={products} 
            totalPages={totalPages} 
            searchParams={searchParams} 
            activeCategoryId={searchParams.category}
          />

          {/* Fallback pagination for SEO / non-JS crawlers */}
          {totalPages > 1 && (
            <noscript>
              <div className="mt-12 flex justify-center gap-4 text-sm">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const active = pageNum === currentPage;
                  const params = new URLSearchParams();
                  if (searchParams.category) params.set("category", searchParams.category);
                  if (searchParams.search) params.set("search", searchParams.search);
                  if (searchParams.sort) params.set("sort", searchParams.sort);
                  params.set("page", String(pageNum));
                  
                  return (
                    <Link
                      key={pageNum}
                      href={`/shop?${params.toString()}`}
                      className={cn(
                        "px-3 py-1 border border-line rounded hover:bg-neutral-50",
                        active && "bg-neutral-100 font-semibold"
                      )}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
            </noscript>
          )}
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
