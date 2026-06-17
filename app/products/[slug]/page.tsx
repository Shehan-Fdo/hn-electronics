import { AddToCartPanel } from "@/components/AddToCartPanel";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductGallery } from "@/components/ProductGallery";
import { formatPrice, sanitizeHtml, stripHtml } from "@/lib/utils";
import { getProduct, getProducts, getCategories, getSettings } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { ShieldCheck, Truck, Tag, Zap } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: stripHtml(product.description).slice(0, 160),
    openGraph: {
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, productsRes, categories, settings] = await Promise.all([
    getProduct(params.slug),
    getProducts({ limit: 4 }),
    getCategories(),
    getSettings()
  ]);

  if (!product) notFound();

  // Find category path
  const categoryId = product.categoryIds?.[0];
  const category = categories.find((c: any) => c._id === categoryId);
  const productCategories = product.categoryIds
    ?.map((id: string) => categories.find((c: any) => c._id === id))
    .filter(Boolean);

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: product.name, href: "#" },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images[0] || '',
    description: stripHtml(product.description).slice(0, 160),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'LKR',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hnelectronics.lk'}/products/${product.slug}`
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8 flex text-sm text-muted">
        <ol className="flex items-center space-x-2">
          {breadcrumb.map((item, index) => (
            <li key={item.name} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <a href={item.href} className="hover:text-ink">
                {item.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Product Images */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product Info */}
        <div className="mt-10 lg:mt-0">
          {productCategories && productCategories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {productCategories.map((cat: any) => (
                <div key={cat._id} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                  {cat.name}
                </div>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-2xl font-semibold text-accent">{formatPrice(product.price)}</p>
          </div>
          
          <div className="mt-8 flex flex-col gap-4">
            <AddToCartPanel product={product} />
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '94770000000'}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${process.env.NEXT_PUBLIC_APP_URL || 'https://hnelectronics.lk'}/products/${product.slug})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded border border-[#25D366] bg-[#25D366] px-8 py-3.5 text-sm font-medium text-white hover:bg-white hover:text-ink focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 transition-colors"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ask about this on WhatsApp
            </a>
          </div>

          {/* Trust Signals */}
          <div className="mt-6 grid grid-cols-3 gap-2 pt-6 border-t border-line sm:mt-8 sm:gap-4 sm:pt-4">
            <div className="flex flex-col items-center justify-start gap-1 text-center sm:flex-row sm:justify-start sm:text-left sm:gap-2">
              <Truck className="h-6 w-6 shrink-0 text-accent sm:h-4 sm:w-4" />
              <span className="text-xs leading-tight text-ink sm:text-sm">Islandwide<br className="sm:hidden" /> Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-start gap-1 text-center sm:flex-row sm:justify-start sm:text-left sm:gap-2">
              <ShieldCheck className="h-6 w-6 shrink-0 text-accent sm:h-4 sm:w-4" />
              <span className="text-xs leading-tight text-ink sm:text-sm">Genuine<br className="sm:hidden" /> Products</span>
            </div>
            <div className="flex flex-col items-center justify-start gap-1 text-center sm:flex-row sm:justify-start sm:text-left sm:gap-2">
              <Tag className="h-6 w-6 shrink-0 text-accent sm:h-4 sm:w-4" />
              <span className="text-xs leading-tight text-ink sm:text-sm">Affordable<br className="sm:hidden" /> products</span>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <section className="mt-8 border-t border-line pt-8 sm:mt-12 sm:pt-10">
          <h2 className="text-2xl font-bold">Description</h2>
          <div className="prose-store mt-6 max-w-4xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
        </section>
      )}

      {productsRes.data.length > 0 && (
        <section className="mt-16 sm:mt-24 border-t border-line pt-16 sm:pt-24">
          <h2 className="mb-8 text-2xl font-bold">You might also like</h2>
          <ProductGrid products={productsRes.data.filter((p: any) => p._id !== product._id).slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
