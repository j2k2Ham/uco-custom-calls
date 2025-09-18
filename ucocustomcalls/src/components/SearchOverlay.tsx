"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { searchProducts } from '@/lib/productStore';

interface SearchOverlayProps { open: boolean; onClose: () => void }

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchProducts>>([]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setResults([]);
    }
  }, [open]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') { onClose(); }
    if (e.key === 'Enter') {
      const r = searchProducts(query, 30);
      setResults(r);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex flex-col">
      <div className="flex items-center gap-4 px-6 pt-8 pb-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="search store"
          aria-label="Search products"
          className="flex-1 bg-transparent text-2xl font-medium outline-none placeholder:text-white/40"
        />
        <button
          onClick={onClose}
          aria-label="Close search"
          className="text-xl px-3 py-1 hover:text-brass"
        >×</button>
      </div>
      <div className="overflow-y-auto px-6 pb-10">
        {results.length === 0 && query && (
          <p className="text-white/60 text-sm">No results.</p>
        )}
        <ul className="divide-y divide-white/10">
          {results.map(p => (
            <li key={p.id}>
              <Link
                href={`/products/${p.slug}`}
                onClick={onClose}
                className="block py-3 hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70"
              >
                <span className="font-semibold">{p.title}</span>
                <span className="text-white/50 ml-2 text-xs uppercase tracking-wide">{p.category}</span>
                <div className="text-sm text-white/70 line-clamp-2">{p.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
