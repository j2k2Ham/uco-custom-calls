import "./../styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { CartProvider } from "@/hooks/useCart";
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
    siteName: "UCO Custom Calls"
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
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        )}
      </body>
    </html>
  );
}