import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });


import { getSettings } from "@/lib/api";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hnelectronics.lk'),
  title: {
    default: "HN Electronics | Premium Components & Electronics Sri Lanka",
    template: "%s | HN Electronics"
  },
  description: "HN Electronics is Sri Lanka's leading supplier of premium electronics, development boards, sensors, components, and tools.",
  alternates: {
    canonical: "/",
    languages: {
      "en-LK": "/",
      "x-default": "/"
    }
  },
  openGraph: {
    title: "HN Electronics | Premium Components & Electronics Sri Lanka",
    description: "HN Electronics is Sri Lanka's leading supplier of premium electronics, development boards, sensors, components, and tools.",
    url: "/",
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

import Script from "next/script";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4QKFPV08PX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4QKFPV08PX');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HN Electronics",
              "url": "https://hnelectronics.lk",
              "logo": "https://hnelectronics.lk/icon.svg",
              "sameAs": [
                "https://facebook.com/hnelectronics",
                "https://twitter.com/hnelectronics",
                "https://x.com/hnelectronics",
                "https://www.linkedin.com/company/hnelectronics",
                "https://www.wikidata.org/wiki/Q123456789",
                "https://en.wikipedia.org/wiki/HN_Electronics",
                "https://github.com/hnelectronics",
                "https://youtube.com/hnelectronics",
                "https://instagram.com/hnelectronics"
              ]
            })
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <AnnouncementBar text={settings?.announcementText} />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
