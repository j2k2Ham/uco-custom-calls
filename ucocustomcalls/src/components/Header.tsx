"use client";

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/hooks/useCart";
import { Nav } from "./Nav";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { open, setOpen, count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur bg-camo/70 border-b border-camo-light">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
          <Logo height={32} className="gap-2 flex-shrink-0" />
          <div className="flex-1 flex items-center justify-center">
            <Nav />
          </div>
          <ThemeToggle className="mr-2" />
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
