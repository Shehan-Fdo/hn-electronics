export type WCImage = {
  id: number;
  src: string;
  alt: string;
};

export type WCCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
  image?: WCImage | null;
};

export type WCAttribute = {
  id: number;
  name: string;
  options: string[];
  visible?: boolean;
  variation?: boolean;
};

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: WCImage[];
  categories: WCCategory[];
  short_description: string;
  description: string;
  stock_status: "instock" | "outofstock" | "onbackorder" | string;
  attributes: WCAttribute[];
};

export type ProductQuery = {
  category?: number | string;
  search?: string;
  page?: number | string;
  per_page?: number | string;
};

export type CartItem = {
  product: WCProduct;
  quantity: number;
};
