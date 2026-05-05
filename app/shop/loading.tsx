import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 h-12 w-64 animate-pulse rounded bg-neutral-100" />
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="h-96 rounded bg-neutral-100" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
