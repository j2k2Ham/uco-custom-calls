"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/hooks/useCart";
import { Nav } from "./Nav";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { open, setOpen, count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur bg-camo/70 border-b border-camo-light">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="UCO Custom Calls Home">
            <Image
              src="/images/company-logo-green-2x.png"
              alt="UCO Custom Calls"
              width={248}
              height={140}
              priority
              sizes="(max-width: 640px) 160px, 200px"
              className="h-8 w-auto object-contain"
            />
            <span className="sr-only">UCO Custom Calls</span>
          </Link>
          <Nav />
          <button
            aria-label="Open cart"
            onClick={() => setOpen(true)}
            className="relative rounded-md p-2 hover:bg-camo-light"
          >
            <ShoppingBagIcon className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-brass text-black rounded-full px-1">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
