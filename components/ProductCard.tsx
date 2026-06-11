"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/api";
import { useCart } from "@/context/CartContext";
import { formatPrice, productImageAlt } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fade } from "@/components/Motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const image = product.images?.[0];
  const onSale = Boolean(product.price && product.price !== product.price);

  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.article
      className="group relative flex h-full flex-col"
      variants={fade}
    >
      <Link href={`/products/${product.slug}`} prefetch={false} className="block overflow-hidden rounded border border-line bg-neutral-50">
        <div className="relative aspect-square">
          {image ? (
            <Image
              src={image}
              alt={productImageAlt(product.name, product.name)}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-6 transition-transform duration-300 ease-in-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted">No image</div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {onSale && <Badge>Sale</Badge>}

          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 pt-4">
        <Link href={`/products/${product.slug}`} prefetch={false} className="line-clamp-2 min-h-11 font-medium leading-snug hover:text-accent">
          {product.name}
        </Link>
        <div className="text-sm">
          {onSale ? (
            <div className="flex flex-wrap items-center gap-2">
              <span>{formatPrice(product.price)}</span>
              <span className="text-muted line-through">{formatPrice(product.price)}</span>
            </div>
          ) : (
            <span>{formatPrice(product.price)}</span>
          )}
        </div>
        <Button
          className="mt-auto relative overflow-hidden"
          fullWidth
          variant="primary"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.div
                key="added"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Added</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Add to Cart</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.article>
  );
}
