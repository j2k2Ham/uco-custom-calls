import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { organizationJsonLD } from '@/lib/structuredData';
import type { Metadata } from "next";
import { CartProvider } from "@/hooks/useCart";
import { UserProvider } from '@/hooks/useUser';
import { ToastProvider } from '@/components/ToastProvider';
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ucocustomcalls.com"),
  title: {
    default: "UCO Custom Calls — Duck & Goose Calls",
    template: "%s | UCO Custom Calls"
  },
  description:
    "Handcrafted duck and goose calls made in Pennsylvania. Acrylic single/double reed and custom paracord lanyards.",
  openGraph: {
    type: "website",
    title: "UCO Custom Calls",
    siteName: "UCO Custom Calls",
    url: 'https://www.ucocustomcalls.com/',
    locale: 'en_US',
    description: 'Handcrafted duck and goose calls made in Pennsylvania. Acrylic single/double reed and custom paracord lanyards.',
    images: [{ url: "/og-base.svg", width: 1200, height: 630, alt: "UCO Custom Calls" }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UCO Custom Calls',
    description: 'Handcrafted duck and goose calls made in Pennsylvania. Acrylic single/double reed and custom paracord lanyards.'
  },
  alternates: { canonical: "/" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const enableProfile = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PROFILE === '1';
  const profiler = (node: React.ReactNode) => enableProfile ? (
    <React.Profiler id="app" onRender={(id, phase, actualDuration, baseDuration) => {
      console.log(`[Profiler] ${id} ${phase} actual=${actualDuration.toFixed(2)}ms base=${baseDuration.toFixed(2)}ms`);
    }}>{node}</React.Profiler>
  ) : node;

  return (
    <html lang="en" className="bg-camo text-white">
      <body className="min-h-screen flex flex-col">
        {profiler(
          <ToastProvider>
            <UserProvider>
              <CartProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <script
                  type="application/ld+json"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLD({
                    name: 'UCO Custom Calls',
                    description: 'Handcrafted duck & goose calls and custom paracord lanyards made in Pennsylvania.',
                    logo: '/images/company-logo-green-2x.png',
                    sameAs: [
                      'https://www.facebook.com/Ucoutfitters/',
                      'https://www.instagram.com/ucocustomcalls/'
                    ]
                  })) }}
                />
                <script
                  type="application/ld+json"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'SiteNavigationElement',
                    name: ['Home','Products','Duck Calls','Goose Calls','Paracord Lanyards','Gear','Sound Files','Custom Calls','About','Contact'],
                    url: [
                      'https://ucocustomcalls.com/',
                      'https://ucocustomcalls.com/products',
                      'https://ucocustomcalls.com/category/duck',
                      'https://ucocustomcalls.com/category/goose',
                      'https://ucocustomcalls.com/category/lanyards',
                      'https://ucocustomcalls.com/category/gear',
                      'https://ucocustomcalls.com/sound-files',
                      'https://ucocustomcalls.com/custom',
                      'https://ucocustomcalls.com/about',
                      'https://ucocustomcalls.com/contact'
                    ]
                  }) }}
                />
              </CartProvider>
            </UserProvider>
          </ToastProvider>
        )}
      </body>
    </html>
  );
}