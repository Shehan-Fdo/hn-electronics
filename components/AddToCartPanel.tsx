"use client";

import { useState } from "react";
import { Check, ShoppingBag, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/api";

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 w-32 shrink-0 items-center rounded border border-line bg-white">
        <button
          className="grid h-full flex-1 place-items-center hover:bg-neutral-50 rounded-l transition-colors"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          className="h-full w-12 border-x border-line text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={quantity}
          min={1}
          type="number"
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
        />
        <button
          className="grid h-full flex-1 place-items-center hover:bg-neutral-50 rounded-r transition-colors"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => q + 1)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        size="lg"
        fullWidth
        className="relative overflow-hidden"
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
    </div>
  );
}
