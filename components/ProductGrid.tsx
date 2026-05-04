"use client";

import { WCProduct } from "@/types/woocommerce";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/components/Motion";

export function ProductGrid({ products }: { products: WCProduct[] }) {
  if (!products.length) {
    return (
      <motion.div
        className="rounded border border-line p-10 text-center"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-semibold">No products found</h2>
        <p className="mt-2 text-sm text-muted">Try a different search or category.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
