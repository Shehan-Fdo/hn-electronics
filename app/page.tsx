import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { LinkButton } from "@/components/ui/Button";
import { getCategories, getProducts } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "HN Electronics",
  description: "Shop genuine electronics, components, and accessories from HN Electronics in Sri Lanka."
};

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ per_page: 8 })
  ]);

  const visibleCategories = categories.filter((category) => category.count > 0).slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <Image
          src="/hero-bg.png"
          alt="Circuit board background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-normal text-accent">HN Electronics Sri Lanka</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              Your Electronics Destination.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Discover reliable electronics, parts, accessories, and everyday tech essentials with a clean shopping experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/shop" size="lg">
                Shop Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/shop#categories" size="lg" className="bg-white/10 text-white hover:bg-white/20 hover:text-white border-0">
                Browse Categories
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">Categories</p>
            <h2 className="mt-2 text-3xl font-bold">Shop by category</h2>
          </div>
          <LinkButton href="/shop" variant="ghost">View all</LinkButton>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-normal text-muted">Latest</p>
          <h2 className="mt-2 text-3xl font-bold">Featured products</h2>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, label: "Islandwide Delivery" },
            { icon: ShieldCheck, label: "Genuine Products" },
            { icon: RotateCcw, label: "Easy Returns" },
            { icon: Zap, label: "Sri Lanka's Trusted Store" }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 rounded border border-line p-4 text-center md:flex-row md:border-0 md:p-0 md:text-left md:rounded-none">
              <item.icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded border border-line p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-3xl font-bold">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="mt-3 text-muted">Message HN Electronics and we&apos;ll confirm availability.</p>
          </div>
          <LinkButton href="/about#contact" className="mt-6 md:mt-0">Contact Us</LinkButton>
        </div>
      </section>
    </div>
  );
}
