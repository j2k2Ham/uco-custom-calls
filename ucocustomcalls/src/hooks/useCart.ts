"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";

type CartItem = { id: string; title: string; price: number; qty: number; slug: string };
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("uco.cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => localStorage.setItem("uco.cart", JSON.stringify(items)), [items]);

  const api = useMemo<CartContext>(() => ({
    items,
    add: (p: Product, qty: number = 1) => {
      setItems((prev: CartItem[]) => {
        const found = prev.find((i: CartItem) => i.id === p.id);
        return found
          ? prev.map((i: CartItem) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
          : [...prev, { id: p.id, title: p.title, price: p.price, qty, slug: p.slug }];
      });
      setOpen(true);
    },
    remove: (id: string) => setItems((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id)),
    clear: () => setItems([]),
    open, setOpen,
    count: items.reduce((n: number, i: CartItem) => n + i.qty, 0),
    total: items.reduce((sum: number, i: CartItem) => sum + i.price * i.qty, 0)
  }), [items, open]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
