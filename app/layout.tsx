import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });


export const metadata: Metadata = {
  title: {
    default: "HN Electronics",
    template: "%s | HN Electronics"
  },
  description: "Premium electronics and components from HN Electronics in Sri Lanka.",
  openGraph: {
    title: "HN Electronics",
    description: "Premium electronics and components from HN Electronics in Sri Lanka.",
    siteName: "HN Electronics",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "HN Electronics"
      }
    ],
    locale: "en_LK",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
