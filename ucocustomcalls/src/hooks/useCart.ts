"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
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

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem("uco.cart") : null;
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("uco.cart", JSON.stringify(items));
    }
  }, [items]);

  const add = useCallback((p: Product, qty: number = 1) => {
    setItems((prev: CartItem[]) => {
      const found = prev.find((i: CartItem) => i.id === p.id);
      return found
        ? prev.map((i: CartItem) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { id: p.id, title: p.title, price: p.price, qty, slug: p.slug }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n: number, i: CartItem) => n + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((sum: number, i: CartItem) => sum + i.price * i.qty, 0), [items]);

  const api = useMemo<CartContext>(() => ({
    items,
    add,
    remove,
    clear,
    open,
    setOpen,
    count,
    total
  }), [items, add, remove, clear, open, count, total]);

  return React.createElement(Ctx.Provider, { value: api }, children);
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
