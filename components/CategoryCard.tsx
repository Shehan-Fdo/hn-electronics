"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types/api";
import { fade } from "@/components/Motion";

export function CategoryCard({ category, count = 0 }: { category: Category; count?: number }) {
  return (
    <motion.div variants={fade}>
      <Link
        href={`/shop?category=${category.slug}`}
        className="group flex items-center justify-between gap-3 rounded border border-line p-4 transition-colors hover:border-ink"
      >
        <h3 className="font-semibold">{category.name}</h3>
        <span className="text-xs text-muted">{count}</span>
      </Link>
    </motion.div>
  );
}
