import type { Metadata } from "next";
import { CartClient } from "@/components/CartClient";
import { getSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Shopping Cart | HN Electronics",
  description: "View and manage items in your shopping cart.",
};

export default async function CartPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your items and proceed to order via WhatsApp.
        </p>
      </div>
      
      <CartClient whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
}
