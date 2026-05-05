import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded border border-line bg-white px-2 py-1 text-[11px] uppercase tracking-normal text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
