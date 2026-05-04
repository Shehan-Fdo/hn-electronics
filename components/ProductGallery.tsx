"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WCImage } from "@/types/woocommerce";
import { productImageAlt, cn } from "@/lib/utils";
import { fade, smoothEase } from "@/components/Motion";

export function ProductGallery({ images, name }: { images: WCImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="min-w-0 space-y-4">
      <div className="relative aspect-square rounded border border-line bg-neutral-50">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.src}
              className="absolute inset-0"
              variants={fade}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <Image
                src={current.src}
                alt={productImageAlt(name, current.alt)}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-8"
              />
            </motion.div>
          ) : (
            <motion.div className="grid h-full place-items-center text-muted" variants={fade} initial="hidden" animate="show">
              No image
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <motion.button
              key={image.id || image.src}
              className={cn(
                "relative h-20 w-20 shrink-0 rounded border bg-neutral-50",
                index === active ? "border-ink" : "border-line"
              )}
              aria-label={`View image ${index + 1}`}
              onClick={() => setActive(index)}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12, ease: smoothEase }}
            >
              <Image src={image.src} alt={productImageAlt(name, image.alt)} fill sizes="80px" className="object-contain p-2" priority />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
