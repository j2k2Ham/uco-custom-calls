"use client";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Price } from "./Price";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, total, clear } = useCart();

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-camo p-5 shadow-2xl">
        <Dialog.Title className="text-xl font-semibold">Your Cart</Dialog.Title>
        <ul className="mt-4 space-y-3 max-h-[60vh] overflow-auto pr-2">
          {items.length === 0 && <li className="text-sky/80">Cart is empty.</li>}
          {items.map(i => (
            <li key={i.id} className="flex items-center justify-between border-b border-camo-light pb-2">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-sky/80">Qty: {i.qty}</div>
              </div>
              <div className="text-right">
                <div><Price cents={i.priceCents * i.qty} /></div>
                <button onClick={() => remove(i.id)} className="text-xs text-sky/70 hover:text-white mt-1">Remove</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sky/80">Subtotal</div>
          <div className="text-lg"><Price cents={total} /></div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={clear} className="px-3 py-2 border rounded-md">Clear</button>
          {/* Replace this link with Stripe/Shopify checkout */}
          <Link href="/contact" onClick={onClose}
            className="flex-1 text-center px-4 py-2 bg-brass text-black rounded-md">
            Checkout Inquiry
          </Link>
        </div>
      </div>
    </Dialog>
  );
}
