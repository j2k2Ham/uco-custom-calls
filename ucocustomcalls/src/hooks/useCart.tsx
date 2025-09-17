"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from './useUser';
import type { Product } from "@/types/product";

type CartItem = { id: string; title: string; priceCents: number; qty: number; slug: string };
type CartContext = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  count: number;
  total: number;
};
const Ctx = createContext<CartContext | null>(null);

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Key incorporates user id for separation; guest carts stored under guest key
  const storageKey = user ? `uco.cart.${user.id}` : 'uco.cart.guest';
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch { /* ignore parse error, keep current */ }
    }
  }, [storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, storageKey]);

  function upsertItem(prev: CartItem[], p: Product, qty: number): CartItem[] {
    const existingIndex = prev.findIndex(i => i.id === p.id);
    if (existingIndex === -1) {
      return [...prev, { id: p.id, title: p.title, priceCents: p.priceCents, qty, slug: p.slug }];
    }
    const clone = [...prev];
    const current = clone[existingIndex];
    clone[existingIndex] = { ...current, qty: current.qty + qty };
    return clone;
  }

  function removeItem(prev: CartItem[], id: string): CartItem[] {
    return prev.filter(i => i.id !== id);
  }

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.priceCents * i.qty, 0), [items]);

  const api = useMemo<CartContext>(() => ({
    items,
    add: (p: Product, qty: number = 1) => {
      setItems(prev => upsertItem(prev, p, qty));
      setOpen(true);
    },
    remove: (id: string) => setItems(prev => removeItem(prev, id)),
    clear: () => setItems([]),
    open,
    setOpen,
    count,
    total
  }), [items, open, count, total]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
