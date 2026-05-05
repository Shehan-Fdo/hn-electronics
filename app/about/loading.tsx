import { Skeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-14 w-2/3" />
      <Skeleton className="mt-6 h-28 w-full" />
    </div>
  );
}
