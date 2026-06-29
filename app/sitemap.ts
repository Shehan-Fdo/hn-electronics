import { MetadataRoute } from 'next';
import { getProducts, getCategories } from '@/lib/api';
import { Product } from '@/types/api';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hnelectronics.lk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic data page by page to bypass backend limit
  const products: Product[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await getProducts({ limit: 100, page });
      if (response && response.data) {
        products.push(...response.data);
        totalPages = response.totalPages || 1;
      } else {
        break;
      }
      page++;
    } while (page <= totalPages);
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  const categories = await getCategories();

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Dynamic Category Routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/shop?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Product Routes
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes];
}
