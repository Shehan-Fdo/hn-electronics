"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { WCProduct } from "@/types/woocommerce";

export function AddToCartPanel({ product }: { product: WCProduct }) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);

  const handleAdd = () => {

    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      fullWidth
      variant="primary"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.div
            key="added"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Check className="h-5 w-5" aria-hidden="true" />
            <span>Added to Cart</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
