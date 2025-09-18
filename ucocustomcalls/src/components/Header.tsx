"use client";

import { Logo } from "./Logo";
import { SearchOverlay } from './SearchOverlay';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from "./ThemeToggle";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ProfileMenu } from './ProfileMenu';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useCart } from "@/hooks/useCart";
import { Nav } from "./Nav";
import Link from 'next/link';
import React from 'react';
import { CartDrawer } from "./CartDrawer";
import { NavStorageKey, getStored, setStored } from '@/lib/navStorage';

export function Header() {
  const { open, setOpen, count } = useCart();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [shopOpen, setShopOpen] = React.useState(false);
  const [huntingOpen, setHuntingOpen] = React.useState(false);

  React.useEffect(() => {
    const s = getStored(NavStorageKey.ShopOpen);
    if (s === '1') setShopOpen(true);
    const h = getStored(NavStorageKey.HuntingOpen);
    if (h === '1') setHuntingOpen(true);
  }, []);
  React.useEffect(() => { setStored(NavStorageKey.ShopOpen, shopOpen ? '1' : '0'); }, [shopOpen]);
  React.useEffect(() => { setStored(NavStorageKey.HuntingOpen, huntingOpen ? '1' : '0'); }, [huntingOpen]);

  return (
    <>
  <header className="sticky top-0 z-50 backdrop-blur bg-header/95 border-b border-camo-light">
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
            type="button"
            aria-label="Search the store"
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md hover:bg-camo-light"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
          <ProfileMenu />
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
                <li><Link className="py-2 hover:text-brass" href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
                <li>
                  <button
                    className="w-full text-left py-2 flex items-center justify-between hover:text-brass"
                    aria-expanded={shopOpen}
                    onClick={() => setShopOpen(o => { const next = !o; if (next) setHuntingOpen(false); return next; })}
                  >
                    <span>Shop</span>
                    <ChevronDownIcon aria-hidden className={`w-4 h-4 transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {shopOpen && (
                    <ul className="ml-4 mt-1 border-l border-camo-light pl-4 flex flex-col gap-1">
                      <li><Link className="hover:text-brass py-1" href="/category/duck" onClick={() => setMobileOpen(false)}>Duck Calls</Link></li>
                      <li><Link className="hover:text-brass py-1" href="/category/goose" onClick={() => setMobileOpen(false)}>Goose Calls</Link></li>
                      <li><Link className="hover:text-brass py-1" href="/category/lanyards" onClick={() => setMobileOpen(false)}>Paracord Lanyards</Link></li>
                    </ul>
                  )}
                </li>
                <li>
                  <button
                    className="w-full text-left py-2 flex items-center justify-between hover:text-brass"
                    aria-expanded={huntingOpen}
                    onClick={() => setHuntingOpen(o => { const next = !o; if (next) setShopOpen(false); return next; })}
                  >
                    <span>Hunting</span>
                    <ChevronDownIcon aria-hidden className={`w-4 h-4 transition-transform ${huntingOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {huntingOpen && (
                    <ul className="ml-4 mt-1 border-l border-camo-light pl-4 flex flex-col gap-1">
                      <li><Link className="hover:text-brass py-1" href="/sound-files" onClick={() => setMobileOpen(false)}>Sound Files</Link></li>
                    </ul>
                  )}
                </li>
                <li><Link className="py-2 hover:text-brass" href="/custom" onClick={() => setMobileOpen(false)}>Custom Calls</Link></li>
                <li><Link className="py-2 hover:text-brass" href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
                <li><Link className="py-2 hover:text-brass" href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
              </ul>
            </nav>
          </div>
        )}
      </header>
  <CartDrawer open={open} onClose={() => setOpen(false)} />
  <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
