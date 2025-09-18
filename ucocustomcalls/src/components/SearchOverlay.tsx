"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { searchProducts } from '@/lib/productStore';

interface SearchOverlayProps { open: boolean; onClose: () => void }

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setResults([]);
      setSubmitted(false);
    }
  }, [open]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') { onClose(); }
    if (e.key === 'Enter') {
      const r = searchProducts(query, 30);
      setResults(r);
      setSubmitted(true);
    }
  };

  const onChange = (v: string) => {
    setQuery(v);
    if (submitted) {
      // User started typing a new query; clear previous results until next Enter
      setResults([]);
      setSubmitted(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex flex-col">
      <button
        onClick={onClose}
        aria-label="Close search"
        className="absolute top-6 right-6 text-2xl leading-none px-3 py-1 hover:text-brass"
      >×</button>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="search the store"
            aria-label="Search products"
            className="w-full bg-transparent text-4xl font-medium outline-none placeholder:text-white/30 border-b-2 border-brass pb-3"
          />
        </div>
        {submitted && (
          <div className="mt-10 w-full max-w-3xl overflow-y-auto max-h-[50vh] px-1">
            {results.length === 0 ? (
              <p className="text-white/60 text-sm">No results.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {results.map(p => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="block py-4 hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70"
                    >
                      <span className="font-semibold text-lg">{p.title}</span>
                      <span className="text-white/50 ml-2 text-xs uppercase tracking-wide">{p.category}</span>
                      <div className="text-sm text-white/70 line-clamp-2 mt-1">{p.description}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
