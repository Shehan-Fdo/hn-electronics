"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Minus, Plus, ShoppingCart, Trash2, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LinkButton } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice, productImageAlt } from "@/lib/utils";
import { CartItem } from "@/types/api";
import { fade, fadeUp, smoothEase, staggerContainer } from "@/components/Motion";

function buildWhatsAppMessage(items: CartItem[], subtotal: number) {
  const lines = items.map((item, index) => {
    const lineTotal = Number(item.product.price || 0) * item.quantity;
    return `${index + 1}. ${item.product.name} × ${item.quantity} — ${formatPrice(lineTotal)}`;
  });

  return [
    "Hi HN Electronics! I'd like to place an order:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Total: ${formatPrice(subtotal)}`,
    "",
    "Please confirm availability and delivery details. Thank you!"
  ].join("\n");
}

function buildCopyMessage(items: CartItem[], subtotal: number) {
  const lines = items.map((item, index) => {
    const lineTotal = Number(item.product.price || 0) * item.quantity;
    return `${index + 1}. ${item.product.name} × ${item.quantity} — ${formatPrice(lineTotal)}`;
  });

  return [
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Total: ${formatPrice(subtotal)}`
  ].join("\n");
}

export function CartClient() {
  const { items, subtotal, removeItem, updateQty, clearCart } = useCart();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = buildCopyMessage(items, subtotal);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function orderViaWhatsApp() {
    if (!whatsappNumber) {
      alert("WhatsApp ordering is not available right now. Please contact us directly.");
      return;
    }
    const message = encodeURIComponent(buildWhatsAppMessage(items, subtotal));
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  if (!items.length) {
    return (
      <motion.section className="mx-auto max-w-3xl px-4 py-24 text-center" variants={fade} initial="hidden" animate="show">
        <ShoppingCart className="mx-auto h-20 w-20 stroke-1 text-muted" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted">Browse products and add what you need.</p>
        <LinkButton className="mt-8" href="/shop">
          Browse Products
        </LinkButton>
      </motion.section>
    );
  }

  return (
    <motion.div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" variants={fade} initial="hidden" animate="show">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-normal text-muted">Order review</p>
          <h1 className="mt-2 text-4xl font-bold">Cart</h1>
        </div>
        <Button variant="ghost" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <motion.section className="space-y-4" variants={staggerContainer} initial="hidden" animate="show">
          <AnimatePresence initial={false}>
          {items.map((item) => {
            const image = item.product.images?.[0];
            const lineTotal = Number(item.product.price || 0) * item.quantity;
            return (
              <motion.article
                key={item.product._id}
                className="grid grid-cols-[112px_1fr] gap-4 rounded border border-line p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center"
                variants={fadeUp}
                exit={{ opacity: 0, x: -12, transition: { duration: 0.18, ease: smoothEase } }}
                layout
              >
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative h-28 w-28 shrink-0 rounded border border-line bg-neutral-50"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={item.product.name}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                    />
                  ) : null}
                </Link>
                <div className="min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-accent">
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatPrice(item.product.price)}</p>
                  <div className="mt-4 flex w-fit items-center rounded border border-line">
                    <button
                      className="grid h-10 w-10 shrink-0 place-items-center"
                      aria-label={`Decrease quantity for ${item.product.name}`}
                      onClick={() =>
                        item.quantity === 1
                          ? removeItem(item.product._id)
                          : updateQty(item.product._id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      aria-label={`Quantity for ${item.product.name}`}
                      className="h-10 w-12 shrink-0 border-x border-line text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={item.quantity}
                      min={1}
                      type="number"
                      onChange={(event) => updateQty(item.product._id, Number(event.target.value))}
                    />
                    <button
                      className="grid h-10 w-10 shrink-0 place-items-center"
                      aria-label={`Increase quantity for ${item.product.name}`}
                      onClick={() => updateQty(item.product._id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line pt-4 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <p className="font-semibold">{formatPrice(lineTotal)}</p>
                  <button
                    className="mt-0 rounded border border-line p-2 text-muted hover:text-ink sm:mt-4"
                    aria-label={`Remove ${item.product.name}`}
                    onClick={() => removeItem(item.product._id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </motion.section>

        <motion.aside className="h-fit rounded border border-line p-6" variants={fadeUp}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center text-muted transition-colors hover:text-ink"
              aria-label="Copy order summary"
              title="Copy order summary"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-5 w-5 text-ink" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between gap-4 text-sm">
                <span className="text-muted">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="shrink-0">
                  {formatPrice(Number(item.product.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="my-6 border-t border-line" />
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-3 text-sm text-muted">Shipping calculated on confirmation</p>
          <div className="my-6 border-t border-line" />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-4 text-sm text-muted">No payment is processed here. Complete your order via WhatsApp.</p>
          <Button className="mt-6" fullWidth variant="whatsapp" onClick={orderViaWhatsApp}>
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Order via WhatsApp
          </Button>
        </motion.aside>
      </div>
    </motion.div>
  );
}
