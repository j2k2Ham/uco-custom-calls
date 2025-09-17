"use client";

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/hooks/useCart";
import { Nav } from "./Nav";
import Link from 'next/link';
import React from 'react';
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { open, setOpen, count } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [shopOpen, setShopOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const s = localStorage.getItem('nav.shop');
      if (s === '1') setShopOpen(true);
    } catch {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem('nav.shop', shopOpen ? '1' : '0'); } catch {}
  }, [shopOpen]);

  return (
    <>
  <header className="sticky top-0 z-50 backdrop-blur bg-camo/80 border-b border-camo-light">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded hover:bg-camo-light"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(o => !o)}
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
          <Logo height={32} className="gap-2 flex-shrink-0" />
          <div className="flex-1 hidden md:flex items-center justify-center">
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
        {mobileOpen && (
          <div className="md:hidden border-t border-camo-light px-4 pb-4 animate-slideDown">
            <nav aria-label="Mobile" className="mt-3">
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    className="w-full text-left py-2 flex items-center justify-between hover:text-brass"
                    aria-expanded={shopOpen}
                    onClick={() => setShopOpen(o => !o)}
                  >
                    <span>Shop</span>
                    <span className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {shopOpen && (
                    <ul className="ml-4 mt-1 border-l border-camo-light pl-4 flex flex-col gap-1">
                      <li><Link className="hover:text-brass" href="/category/duck" onClick={() => setMobileOpen(false)}>Duck Calls</Link></li>
                      <li><Link className="hover:text-brass" href="/category/goose" onClick={() => setMobileOpen(false)}>Goose Calls</Link></li>
                      <li><Link className="hover:text-brass" href="/category/lanyards" onClick={() => setMobileOpen(false)}>Paracord Lanyards</Link></li>
                    </ul>
                  )}
                </li>
                <li><Link className="py-2 hover:text-brass" href="/sound-files" onClick={() => setMobileOpen(false)}>Sound Files</Link></li>
                <li><Link className="py-2 hover:text-brass" href="/custom" onClick={() => setMobileOpen(false)}>Custom Calls</Link></li>
                <li><Link className="py-2 hover:text-brass" href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
                <li><Link className="py-2 hover:text-brass" href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
              </ul>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
