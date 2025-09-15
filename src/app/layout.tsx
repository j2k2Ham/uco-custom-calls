import "./../styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { CartProvider } from "@/hooks/useCart";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-camo text-white">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}