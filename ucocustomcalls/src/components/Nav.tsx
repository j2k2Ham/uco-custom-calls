"use client";
import Link from "next/link";
import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { NavStorageKey, getStored, setStored } from '@/lib/navStorage';

function Caret({ open }: { readonly open: boolean }) {
  return <ChevronDownIcon aria-hidden className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />;
}

export function Nav() {
  const shopItems = [
    { href: "/category/duck", label: "Duck Calls" },
    { href: "/category/goose", label: "Goose Calls" },
    { href: "/category/lanyards", label: "Paracord Lanyards" },
    { href: "/category/gear", label: "Gear" }
  ];
  const huntingItems = [
    { href: "/sound-files", label: "Sound Files" }
  ];
  const otherLinks = [
    { href: "/custom", label: "Custom Calls" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];
  const [openShop, setOpenShop] = React.useState(false);
  const [openHunting, setOpenHunting] = React.useState(false);
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw || '';
  const shopBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const shopMenuRef = React.useRef<HTMLUListElement | null>(null);
  const huntingBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const huntingMenuRef = React.useRef<HTMLUListElement | null>(null);
  const lastShopItemRef = React.useRef<string | null>(null);
  const lastHuntingItemRef = React.useRef<string | null>(null);

  // Restore last focused submenu item (no auto-opening to avoid hydration mismatch)
  React.useEffect(() => {
    const s = getStored(NavStorageKey.LastShopItem);
    if (s) lastShopItemRef.current = s;
    const h = getStored(NavStorageKey.LastHuntingItem);
    if (h) lastHuntingItemRef.current = h;
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!openShop && !openHunting) return;
      if (e.key === 'Escape') {
        if (openShop) {
          setOpenShop(false);
          shopBtnRef.current?.focus();
        }
        if (openHunting) {
          setOpenHunting(false);
          huntingBtnRef.current?.focus();
        }
      }
    }
    function onClick(e: MouseEvent | TouchEvent) {
      if (openShop) {
        if (shopMenuRef.current && !shopMenuRef.current.contains(e.target as Node) && !shopBtnRef.current?.contains(e.target as Node)) {
          setOpenShop(false);
        }
      }
      if (openHunting) {
        if (huntingMenuRef.current && !huntingMenuRef.current.contains(e.target as Node) && !huntingBtnRef.current?.contains(e.target as Node)) {
          setOpenHunting(false);
        }
      }
    }
    function onResize() {
      if (window.innerWidth < 768) { // md breakpoint
        if (openShop) setOpenShop(false);
        if (openHunting) setOpenHunting(false);
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('touchstart', onClick);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('touchstart', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, [openShop, openHunting]);

  // Menubar refs & state
  const topRefs = React.useRef<HTMLElement[]>([]);
  const [topIndex, setTopIndex] = React.useState(0);
  React.useEffect(() => {
    topRefs.current.forEach((el, i) => { if (el) el.tabIndex = i === topIndex ? 0 : -1; });
  }, [topIndex]);
  const move = (d: number, from?: HTMLElement) => {
    setTopIndex(prev => {
      const refs = topRefs.current.filter(Boolean);
      const count = refs.length;
      let currentIdx = from ? topRefs.current.indexOf(from) : topRefs.current.indexOf(document.activeElement as HTMLElement);
      if (currentIdx < 0) currentIdx = prev;
      const next = (currentIdx + d + count) % count;
      requestAnimationFrame(() => { topRefs.current[next]?.focus(); });
      return next;
    });
  };

  return (
  <nav aria-label="Primary">
  <ul className="hidden md:flex gap-6 items-center" role="menubar" aria-orientation="horizontal" aria-label="Main menu">
        <li role="none">
          <Link
            href="/"
            ref={el => { if (el) topRefs.current[0] = el; }}
            role="menuitem"
            tabIndex={0}
            className={`hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 rounded-sm ${pathname === '/' ? 'text-brass' : ''}`}
            aria-current={pathname === '/' ? 'page' : undefined}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') { e.preventDefault(); move(1, e.currentTarget); }
              else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1, e.currentTarget); }
            }}
          >Home</Link>
        </li>
  <li className="relative" data-nav-shop role="none">
          <button
            ref={el => { shopBtnRef.current = el; if (el) topRefs.current[1] = el; }}
            role="menuitem"
            className={`hover:text-brass inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 rounded-sm ${openShop ? 'text-brass' : ''}`}
            aria-haspopup="menu"
            aria-expanded={openShop}
            id="nav-shop-trigger"
            onClick={() => setOpenShop(o => { const next = !o; if (next) { setOpenHunting(false); } return next; })}
            onKeyDown={e => {
                const SPACE_KEY = ' ';
                if (["ArrowDown", "Enter"].includes(e.key) || e.key === SPACE_KEY) {
                e.preventDefault();
                setOpenShop(true); setOpenHunting(false);
                // focus first item next tick
                requestAnimationFrame(() => {
                  const selector = lastShopItemRef.current ? `a[href='${lastShopItemRef.current}']` : 'a';
                  const first = shopMenuRef.current?.querySelector(selector) || shopMenuRef.current?.querySelector('a');
                  (first as HTMLElement | null)?.focus();
                });
              }
              if (e.key === 'ArrowRight') { e.preventDefault(); move(1, e.currentTarget); }
              else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1, e.currentTarget); }
            }}
          >
            Shop
            <Caret open={openShop} />
          </button>
          {openShop && (
            <ul
              ref={shopMenuRef}
              role="menu"
              aria-labelledby="nav-shop-trigger"
              className="absolute mt-2 left-0 min-w-[12rem] rounded-md border border-camo-light bg-camo shadow-lg py-2 flex flex-col focus:outline-none animate-fadeInScale"
            >
              {shopItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href} role="none">
                    <Link
                      role="menuitem"
                      aria-current={active ? 'page' : undefined}
                      tabIndex={0}
                      className={`px-4 py-2 text-sm block focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 rounded-sm hover:bg-camo-light focus:bg-camo-light ${active ? 'text-brass' : ''}`}
                      href={item.href}
                      onClick={() => { setOpenShop(false); lastShopItemRef.current = item.href; setStored(NavStorageKey.LastShopItem, item.href); }}
                      onKeyDown={e => {
                        const items = shopMenuRef.current ? Array.from(shopMenuRef.current.querySelectorAll('a')) as HTMLElement[] : [];
                        const idxCurrent = items.indexOf(e.currentTarget as HTMLElement);
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const next = items[(idxCurrent + 1) % items.length];
                          next?.focus();
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = items[(idxCurrent - 1 + items.length) % items.length];
                          prev?.focus();
                        } else if (e.key === 'Home') {
                          e.preventDefault();
                          items[0]?.focus();
                        } else if (e.key === 'End') {
                          e.preventDefault();
                          items[items.length - 1]?.focus();
                        } else if (e.key === 'Tab') {
                          // Focus trap: cycle without closing
                          e.preventDefault();
                          if (e.shiftKey) {
                            const prev = items[(idxCurrent - 1 + items.length) % items.length];
                            prev?.focus();
                          } else {
                            const next = items[(idxCurrent + 1) % items.length];
                            next?.focus();
                          }
                        } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                          e.preventDefault();
                          huntingBtnRef.current?.focus();
                        } else if (e.key === 'Escape') {
                          setOpenShop(false);
                          shopBtnRef.current?.focus();
                        }
                      }}
                    >{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
  <li className="relative" data-nav-hunting role="none">
          <button
            ref={el => { huntingBtnRef.current = el; if (el) topRefs.current[2] = el; }}
            role="menuitem"
            className={`hover:text-brass inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 rounded-sm ${openHunting ? 'text-brass' : ''}`}
            aria-haspopup="menu"
            aria-expanded={openHunting}
            id="nav-hunting-trigger"
            onClick={() => setOpenHunting(o => { const next = !o; if (next) { setOpenShop(false); } return next; })}
            onKeyDown={e => {
              if (["ArrowDown","Enter"," "].includes(e.key)) {
                e.preventDefault();
                setOpenHunting(true); setOpenShop(false);
                requestAnimationFrame(() => {
                  const selector = lastHuntingItemRef.current ? `a[href='${lastHuntingItemRef.current}']` : 'a';
                  const first = huntingMenuRef.current?.querySelector(selector) || huntingMenuRef.current?.querySelector('a');
                  (first as HTMLElement | null)?.focus();
                });
              }
              if (e.key === 'ArrowRight') { e.preventDefault(); move(1, e.currentTarget); }
              else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1, e.currentTarget); }
            }}
          >
            Hunting
            <Caret open={openHunting} />
          </button>
          {openHunting && (
            <ul
              ref={huntingMenuRef}
              role="menu"
              aria-labelledby="nav-hunting-trigger"
              className="absolute mt-2 left-0 min-w-[12rem] rounded-md border border-camo-light bg-camo shadow-lg py-2 flex flex-col focus:outline-none animate-fadeInScale"
            >
              {huntingItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href} role="none">
                    <Link
                      role="menuitem"
                      aria-current={active ? 'page' : undefined}
                      tabIndex={0}
                      className={`px-4 py-2 text-sm block focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 rounded-sm hover:bg-camo-light focus:bg-camo-light ${active ? 'text-brass' : ''}`}
                      href={item.href}
                      onClick={() => { setOpenHunting(false); lastHuntingItemRef.current = item.href; setStored(NavStorageKey.LastHuntingItem, item.href); }}
                      onKeyDown={e => {
                        const items = huntingMenuRef.current ? Array.from(huntingMenuRef.current.querySelectorAll('a')) as HTMLElement[] : [];
                        const idxCurrent = items.indexOf(e.currentTarget as HTMLElement);
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const next = items[(idxCurrent + 1) % items.length];
                          next?.focus();
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = items[(idxCurrent - 1 + items.length) % items.length];
                          prev?.focus();
                        } else if (e.key === 'Home') {
                          e.preventDefault();
                          items[0]?.focus();
                        } else if (e.key === 'End') {
                          e.preventDefault();
                          items[items.length - 1]?.focus();
                        } else if (e.key === 'Tab') {
                          // Focus trap cycle
                          e.preventDefault();
                          if (e.shiftKey) {
                            const prev = items[(idxCurrent - 1 + items.length) % items.length];
                            prev?.focus();
                          } else {
                            const next = items[(idxCurrent + 1) % items.length];
                            next?.focus();
                          }
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                          e.preventDefault();
                          shopBtnRef.current?.focus();
                        } else if (e.key === 'Escape') {
                          setOpenHunting(false);
                          huntingBtnRef.current?.focus();
                        }
                      }}
                    >{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
        {otherLinks.map((l, idx) => {
          const active = pathname.startsWith(l.href);
          const refIndex = 3 + idx; // after Home(0), Shop(1), Hunting(2)
          return (
            <li key={l.href} role="none">
              <Link
                role="menuitem"
                ref={el => { if (el) topRefs.current[refIndex] = el; }}
                className={`hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 rounded-sm ${active ? 'text-brass' : ''}`}
                aria-current={active ? 'page' : undefined}
                href={l.href}
                tabIndex={-1}
                onKeyDown={e => {
                  if (e.key === 'ArrowRight') { e.preventDefault(); move(1, e.currentTarget); }
                  else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1, e.currentTarget); }
                }}
              >{l.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
