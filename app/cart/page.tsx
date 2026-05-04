import type { Metadata } from "next";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your HN Electronics order before sending it via WhatsApp."
};

export default function CartPage() {
  return <CartClient />;
}
