"use client";
"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from './useUser';
import type { Product } from "@/types/product";
import { getPriceCents } from "@/types/product";

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

	const storageKey = user ? `uco.cart.${user.id}` : 'uco.cart.guest';
	useEffect(() => {
		const raw = localStorage.getItem(storageKey);
		if (raw) {
			try {
				type UnknownItem = { priceCents?: number; price?: number; [k: string]: unknown };
				const parsed = JSON.parse(raw) as UnknownItem[];
				if (Array.isArray(parsed)) {
					const normalized = parsed
						.map(it => {
							const base = it as Record<string, unknown>;
							if (typeof base.id !== 'string' || typeof base.title !== 'string' || typeof base.slug !== 'string') return null;
							const qty = typeof base.qty === 'number' && base.qty > 0 ? base.qty : 1;
							let priceCents = 0;
							if (typeof base.priceCents === 'number' && !Number.isNaN(base.priceCents)) priceCents = base.priceCents;
							else if (typeof base.price === 'number' && !Number.isNaN(base.price)) {
								priceCents = getPriceCents({ price: base.price as number });
							}
							return { id: base.id as string, title: base.title as string, slug: base.slug as string, qty, priceCents };
						})
						.filter(Boolean) as CartItem[];
					setItems(normalized);
				}
			} catch {
				/* ignore parse errors */
			}
		}
	}, [storageKey]);
	useEffect(() => localStorage.setItem(storageKey, JSON.stringify(items)), [items, storageKey]);

	function upsertItem(prev: CartItem[], p: Product, qty: number): CartItem[] {
		const existingIndex = prev.findIndex(i => i.id === p.id);
		if (existingIndex === -1) {
			const priceCents = getPriceCents(p as unknown as { priceCents?: number; price?: number });
			return [...prev, { id: p.id, title: p.title, priceCents, qty, slug: p.slug }];
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

		return React.createElement(Ctx.Provider, { value: api }, children);
}
export function useCart() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
