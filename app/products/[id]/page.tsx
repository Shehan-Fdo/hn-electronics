import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartPanel } from "@/components/AddToCartPanel";
import { ProductGrid } from "@/components/ProductGrid";
import { formatPrice, sanitizeHtml, stripHtml } from "@/lib/utils";
import { getProduct, getProducts } from "@/lib/woocommerce";

type ProductPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.id);
    const description = stripHtml(product.short_description || product.description).slice(0, 160);
    const images = product.images?.[0] ? [{ url: product.images[0].src, alt: product.name }] : [];

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
    product = await getProduct(params.id);
  } catch {
    return notFound();
  }

  const category = product.categories?.[0];
  const related = category
    ? (await getProducts({ category: category.id, per_page: 5 })).filter((item) => item.id !== product.id).slice(0, 4)
    : [];
  const onSale = Boolean(product.sale_price && product.sale_price !== product.regular_price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/shop", label: "Shop" },
          ...(category ? [{ href: `/shop?category=${category.slug}`, label: category.name }] : []),
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
                <span>{formatPrice(product.sale_price)}</span>
                <span className="text-base text-muted line-through">{formatPrice(product.regular_price)}</span>
              </div>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
          {product.short_description && (
            <div
              className="prose-store mt-6 text-muted break-words"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.short_description) }}
            />
          )}
          <div className="mt-8">
            <AddToCartPanel product={product} />
          </div>
          {product.attributes?.length > 0 && (
            <div className="mt-10 rounded border border-line p-5">
              <h2 className="font-semibold">Details</h2>
              <dl className="mt-4 grid gap-3">
                {product.attributes
                  .filter((attribute) => attribute.visible !== false)
                  .map((attribute) => (
                    <div key={attribute.id || attribute.name} className="grid gap-1 sm:grid-cols-3">
                      <dt className="text-sm text-muted">{attribute.name}</dt>
                      <dd className="sm:col-span-2">{attribute.options.join(", ")}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
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
