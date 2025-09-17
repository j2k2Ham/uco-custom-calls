"use client";
import Link from "next/link";
import React from 'react';
import { usePathname } from 'next/navigation';

export function Nav() {
  const shopItems = [
    { href: "/category/duck", label: "Duck Calls" },
    { href: "/category/goose", label: "Goose Calls" },
    { href: "/category/lanyards", label: "Paracord Lanyards" }
  ];
  const otherLinks = [
    { href: "/custom", label: "Custom Calls" },
    { href: "/sound-files", label: "Sound Files" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];
  const [open, setOpen] = React.useState(false);
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw || '';
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLUListElement | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <nav aria-label="Primary">
      <ul className="hidden md:flex gap-6 items-center">
        <li className="relative" data-nav-shop>
          <button
            ref={btnRef}
            className={`hover:text-brass inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 rounded-sm ${open ? 'text-brass' : ''}`}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
            onKeyDown={e => {
              if (["ArrowDown","Enter"," "].includes(e.key)) {
                e.preventDefault();
                setOpen(true);
                // focus first item next tick
                requestAnimationFrame(() => {
                  const first = menuRef.current?.querySelector('a');
                  (first as HTMLElement | null)?.focus();
                });
              }
            }}
          >
            Shop
            <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open && (
            <ul
              ref={menuRef}
              role="menu"
              aria-label="Shop"
              className="absolute mt-2 left-0 min-w-[12rem] rounded-md border border-camo-light bg-camo shadow-lg py-2 flex flex-col focus:outline-none animate-fadeInScale"
            >
              {shopItems.map((item, idx) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href} role="none">
                    <Link
                      role="menuitem"
                      aria-current={active ? 'page' : undefined}
                      tabIndex={0}
                      className={`px-4 py-2 text-sm block focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 rounded-sm ${active ? 'text-brass' : ''} hover:bg-camo-light focus:bg-camo-light`}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      onKeyDown={e => {
                        const items = menuRef.current ? Array.from(menuRef.current.querySelectorAll('a')) as HTMLElement[] : [];
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
                          // Close if tabbing out of last item or shift-tabbing before first
                          if (!e.shiftKey && idx === shopItems.length - 1) {
                            setOpen(false);
                          } else if (e.shiftKey && idx === 0) {
                            setOpen(false);
                          }
                        } else if (e.key === 'Escape') {
                          setOpen(false);
                          btnRef.current?.focus();
                        }
                      }}
                    >{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
        {otherLinks.map(l => {
          const active = pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                className={`hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 rounded-sm ${active ? 'text-brass' : ''}`}
                aria-current={active ? 'page' : undefined}
                href={l.href}
              >{l.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
