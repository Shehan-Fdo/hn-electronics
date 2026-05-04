import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-bold">HN Electronics</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
            Premium electronics, components, and accessories for Sri Lankan homes, creators, and repair desks.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-normal text-white/60">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/about#contact">Contact</Link>
            <Link href="/cart">Cart</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-normal text-white/60">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            <p>WhatsApp: +94 78 663 7512</p>
            <p>Email: hello@hnelectronics.lk</p>
            <p>Sri Lanka</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} HN Electronics. All rights reserved.
      </div>
    </footer>
  );
}
