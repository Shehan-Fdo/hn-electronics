export type Category = {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  wholesalePrice?: number;
  images: string[];
  categoryIds: string[];
  shortDescription?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductQuery = {
  category?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
  sort?: string;
  order?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  useWholesale?: boolean;
};
