import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const { data: products } = await getProducts({ search: q, limit: 5 });
    
    // Map to a lightweight representation for the suggestions dropdown
    const suggestions = products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.images?.[0] || null,
      alt: p.name
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
