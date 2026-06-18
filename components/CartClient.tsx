"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageCircle, Minus, Plus, ShoppingCart, Trash2, Copy, Check, FileText, Receipt, Bookmark, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LinkButton } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice, productImageAlt } from "@/lib/utils";
import { CartItem } from "@/types/api";
import { fade, fadeUp, smoothEase, staggerContainer } from "@/components/Motion";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useAdminAuth } from "@/hooks/useAdminAuth";

function buildWhatsAppMessage(items: CartItem[], subtotal: number) {
  const lines = items.map((item, index) => {
    const itemPrice = item.useWholesale && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price;
    const lineTotal = Number(itemPrice || 0) * item.quantity;
    const suffix = item.useWholesale ? " (Wholesale)" : "";
    return `${index + 1}. ${item.product.name}${suffix} × ${item.quantity} — ${formatPrice(lineTotal)}`;
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
    const itemPrice = item.useWholesale && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price;
    const lineTotal = Number(itemPrice || 0) * item.quantity;
    const suffix = item.useWholesale ? " (Wholesale)" : "";
    return `${index + 1}. ${item.product.name}${suffix} × ${item.quantity} — ${formatPrice(lineTotal)}`;
  });

  return [
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Total: ${formatPrice(subtotal)}`
  ].join("\n");
}

export function CartClient({ whatsappNumber }: { whatsappNumber?: string }) {
  const { items, subtotal, removeItem, updateQty, clearCart, replaceCart, toggleWholesale } = useCart();
  const [copied, setCopied] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const { isAdmin, token, isReady } = useAdminAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  // Auto-clear status message after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle Draft Restoration
  useEffect(() => {
    const draftId = searchParams?.get('draftId');
    if (!draftId) return;

    const fetchDraft = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.hnelectronics.lk/api";
        const res = await fetch(`${baseUrl}/draft-carts/${draftId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.items) {
            // Re-map items to standard CartItem shape
            const loadedItems = json.data.items.map((i: any) => ({
              product: i.product,
              quantity: i.quantity
            }));
            replaceCart(loadedItems);
          }
        }
        // Remove draftId from URL so it doesn't refetch
        router.replace('/cart');
      } catch (err) {
        console.error("Failed to restore draft cart", err);
      }
    };
    fetchDraft();
  }, [searchParams, replaceCart, router]);

  function handleCopy() {
    const text = buildCopyMessage(items, subtotal);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function orderViaWhatsApp() {
    if (!whatsappNumber) {
      setStatusMessage({ type: 'error', text: "WhatsApp ordering is not available right now. Please contact us directly." });
      return;
    }
    setIsOrdering(true);
    const message = buildWhatsAppMessage(items, subtotal);
    setTimeout(() => {
      setIsOrdering(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }, 1000);
  }

  async function generateDocument(type: 'invoice' | 'pos') {
    if (!token) return;
    setIsGenerating(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.hnelectronics.lk/api";
      const cartData = { items, total: subtotal };
      
      const res = await fetch(`${baseUrl}/documents/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cartData, type })
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
          return;
        }
        throw new Error(data.message || "Failed to generate document");
      }
      
      // Open the generated PDF in a new tab
      window.open(data.data.url, "_blank");
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || "An error occurred" });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveDraft() {
    if (!token || !draftName.trim()) return;

    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.hnelectronics.lk/api";
      // Format items for the backend
      const draftItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price || 0
      }));

      const res = await fetch(`${baseUrl}/draft-carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: draftName.trim(), items: draftItems, total: subtotal })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save draft cart");
      
      setStatusMessage({ type: 'success', text: "Draft cart saved successfully!" });
      setIsDrafting(false);
      setDraftName("");
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || "An error occurred" });
    } finally {
      setIsSaving(false);
    }
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
            const itemPrice = item.useWholesale && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price;
            const lineTotal = Number(itemPrice || 0) * item.quantity;
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
                  <p className="font-semibold">
                    {formatPrice(lineTotal)}
                  </p>
                  <div className="mt-0 flex items-center justify-end gap-2 sm:mt-4">
                    {isAdmin && isReady && (
                      <button
                        className={`rounded border p-2 transition-colors ${
                          !item.product.wholesalePrice
                            ? "border-line text-muted opacity-50 cursor-not-allowed bg-neutral-50"
                            : item.useWholesale 
                              ? "border-green-500 bg-green-50 text-green-700" 
                              : "border-line text-muted hover:text-ink hover:bg-neutral-50"
                        }`}
                        aria-label={`Toggle wholesale price for ${item.product.name}`}
                        title={item.product.wholesalePrice ? "Toggle Wholesale Price" : "No Wholesale Price"}
                        disabled={!item.product.wholesalePrice}
                        onClick={() => toggleWholesale(item.product._id, !item.useWholesale)}
                      >
                        <Tag className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      className="rounded border border-line p-2 text-muted hover:text-ink"
                      aria-label={`Remove ${item.product.name}`}
                      onClick={() => removeItem(item.product._id)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </motion.section>

        <motion.aside className="h-fit rounded border border-line p-6" variants={fadeUp}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="flex items-center gap-2">
              {isAdmin && isReady && !isDrafting && (
                <button
                  onClick={() => setIsDrafting(true)}
                  className="flex items-center justify-center text-muted transition-colors hover:text-ink"
                  aria-label="Save draft cart"
                  title="Save draft cart"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              )}
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
          </div>
          
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className={`overflow-hidden rounded-md border ${
                  statusMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                <div className="px-3 py-2 text-[13px] font-medium">
                  {statusMessage.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAdmin && isReady && isDrafting && (
            <div className="mt-4 flex items-center gap-2 bg-neutral-50/50 p-2 rounded-md border border-line">
              <input 
                type="text" 
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Draft name..."
                className="flex-1 h-8 rounded border border-line px-2.5 text-[13px] outline-none focus:border-ink bg-white transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveDraft()}
              />
              <button
                onClick={handleSaveDraft}
                disabled={isSaving || !draftName.trim()}
                className="px-3 py-1.5 text-[13px] font-medium text-white bg-ink hover:bg-neutral-800 rounded transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setIsDrafting(false); setDraftName(""); }}
                disabled={isSaving}
                className="px-3 py-1.5 text-[13px] font-medium text-muted bg-white border border-line hover:bg-neutral-50 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {items.map((item) => (
               <div key={item.product._id} className="flex justify-between gap-4 text-sm">
                <span className="text-muted">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="shrink-0">
                  {formatPrice(Number(item.useWholesale && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price || 0) * item.quantity)}
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
            <WhatsAppIcon className="h-5 w-5" aria-hidden="true" />
            Order via WhatsApp
          </Button>

          {isReady && isAdmin && (
            <div className="mt-6 border-t border-line pt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Admin Controls</h3>
              <div className="flex gap-2">
                <Button 
                  fullWidth 
                  variant="secondary" 
                  disabled={isGenerating}
                  onClick={() => generateDocument('invoice')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Invoice
                </Button>
                <Button 
                  fullWidth 
                  variant="secondary" 
                  disabled={isGenerating}
                  onClick={() => generateDocument('pos')}
                  className="flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  POS Receipt
                </Button>
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </motion.div>
  );
}
