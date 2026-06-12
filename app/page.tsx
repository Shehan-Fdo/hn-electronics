import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Tag, ShieldCheck, Truck, Zap } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { LinkButton } from "@/components/ui/Button";
import { HeroSlider } from "@/components/HeroSlider";
import { getCategories, getProducts, getSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "HN Electronics",
  description: "Shop genuine electronics, components, and accessories from HN Electronics in Sri Lanka."
};

export default async function HomePage() {
  const [categories, productsRes, settings] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
    getSettings()
  ]);
  const products = productsRes.data;
  const facets = productsRes.facets;

  const visibleCategories = categories.slice(0, 8);

  return (
    <div>
      <HeroSlider 
        title={settings?.heroTitle}
        subtitle={settings?.heroSubtitle}
        textColor={settings?.heroTextColor || 'white'}
        images={settings?.heroBackgroundUrls?.length > 0 ? settings.heroBackgroundUrls : ['/hero-bg.png']}
      />

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">Categories</p>
            <h2 className="mt-2 text-3xl font-bold">Shop by category</h2>
          </div>
          <LinkButton href="/shop" variant="ghost" className="shrink-0 whitespace-nowrap">View all</LinkButton>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {visibleCategories.map((category) => (
            <CategoryCard 
              key={category._id} 
              category={category} 
              count={facets?.categories?.find((f: any) => f._id === category._id)?.count || 0}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-normal text-muted">Latest</p>
          <h2 className="mt-2 text-3xl font-bold">Featured products</h2>
        </div>
        <ProductGrid products={products} />
        <div className="mt-12 flex justify-center">
          <LinkButton href="/shop" variant="secondary" size="lg">
            View all products
          </LinkButton>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, label: "Islandwide Delivery" },
            { icon: ShieldCheck, label: "Genuine Products" },
            { icon: Tag, label: "Affordable products" },
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
