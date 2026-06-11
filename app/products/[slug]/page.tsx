import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartPanel } from "@/components/AddToCartPanel";
import { ProductGrid } from "@/components/ProductGrid";
import { formatPrice, sanitizeHtml, stripHtml } from "@/lib/utils";
import { getProduct, getProducts } from "@/lib/api";

type ProductPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.slug);
    const description = stripHtml(product.shortDescription || product.description).slice(0, 160);
    const images = product.images?.[0] ? [{ url: product.images[0], alt: product.name }] : [];

    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        images
      }
    };
  } catch {
    return {
      title: "Product",
      description: "HN Electronics product details."
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [],
    description: stripHtml(product.shortDescription || product.description),
    sku: (product as any).sku || product._id,
    offers: {
      "@type": "Offer",
      url: `https://www.hnelectronics.lk/products/${product.slug}`,
      priceCurrency: "LKR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  const category = product.categoryIds?.[0]; // just strings for now, or populate them in API if needed
  const related = category
    ? (await getProducts({ category: category, limit: 5 })).data.filter((item) => item._id !== product._id).slice(0, 4)
    : [];
  const onSale = Boolean(product.price && product.price !== product.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/shop", label: "Shop" },
          { label: product.name }
        ]}
      />
      <div className="grid gap-10 sm:grid-cols-2 md:gap-14">
        <ProductGallery images={product.images || []} name={product.name} />
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap gap-2">
            {onSale && <Badge>Sale</Badge>}

          </div>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">{product.name}</h1>
          <div className="mt-5 text-xl">
            {onSale ? (
              <div className="flex flex-wrap items-center gap-3">
                <span>{formatPrice(product.price)}</span>
                <span className="text-base text-muted line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
          {product.shortDescription && (
            <div
              className="prose-store mt-6 text-muted break-words"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription) }}
            />
          )}
          <div className="mt-8">
            <AddToCartPanel product={product} />
          </div>
        </section>
      </div>

      {product.description && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl font-bold">Description</h2>
          <div className="prose-store mt-6 max-w-4xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Related products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
