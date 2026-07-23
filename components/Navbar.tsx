"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/SearchBar";
import { drawerOverlay, drawerPanel, smoothEase } from "@/components/Motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex md:flex-1">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-normal" aria-label="HN Electronics home">
            HN Electronics
          </Link>
        </div>
        <div className="hidden items-center justify-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end gap-4 sm:gap-5 md:flex-1">
          <SearchBar compact liveSearch className="hidden w-full max-w-[200px] xl:max-w-sm lg:flex" />
          <motion.div
            className="shrink-0"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12, ease: smoothEase }}
          >
            <Link
              href="/cart"
              className="relative block rounded border border-line p-2 transition-colors hover:border-ink"
              aria-label="Open cart"
            >
              <motion.div
                key={itemCount}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.15, 0.95, 1.05, 1], rotate: [0, -8, 8, -4, 0] }}
                transition={{ duration: 0.4 }}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </motion.div>
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded bg-accent px-1 text-[11px] text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </motion.div>
          <motion.button
            className="shrink-0 rounded border border-line p-2 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12, ease: smoothEase }}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </div>
      </nav>
    </header>
      <AnimatePresence>
        {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-ink/40 md:hidden"
          variants={drawerOverlay}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.div
            className="ml-auto flex h-full w-[86%] max-w-sm flex-col gap-6 border-l border-line bg-white p-5"
            variants={drawerPanel}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">HN Electronics</span>
              <motion.button
                className="rounded border border-line p-2"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12, ease: smoothEase }}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </motion.button>
            </div>
            <SearchBar compact />
            <div className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded border border-line px-4 py-3 font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
