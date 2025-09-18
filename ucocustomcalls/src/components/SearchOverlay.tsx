"use client";
import React, { useEffect, useRef, useState } from 'react';
import { searchProducts } from '@/lib/productStore';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps { open: boolean; onClose: () => void }

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchProducts>>([]);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSubmitted(false);
    }
  }, [open]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') { onClose(); }
    if (e.key === 'Enter') {
      searchProducts(query, 30); // warm cache / parity with previous behavior
      setSubmitted(true);
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const onChange = (v: string) => {
    setQuery(v);
    if (submitted) {
      // User started typing a new query; clear previous results until next Enter
      setSubmitted(false);
    }
  };

  // Debounced suggestions
  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
  setSuggestions(searchProducts(query, 5));
    }, 220);
    return () => clearTimeout(handle);
  }, [query, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex flex-col">
      <button
        onClick={onClose}
        aria-label="Close search"
        className="absolute top-6 right-6 text-2xl leading-none px-3 py-1 hover:text-brass"
      >×</button>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-full flex justify-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="search the store"
            aria-label="Search products"
            className="bg-transparent text-4xl font-medium tracking-wide outline-none placeholder:text-white/30 border-b-2 border-brass pb-3 transition-[width,padding] duration-300 ease-out w-[40%] min-w-[260px] focus:w-[65%] text-center font-semibold caret-white"
            style={{ maxWidth: '900px', paddingLeft: '0', paddingRight: '0' }}
          />
          {/* Invisible width balancer for center-grow illusion (optional future enhancement) */}
        </div>
        {suggestions.length > 0 && !submitted && (
          <div className="mt-8 w-full max-w-2xl">
            <ul className="bg-black/40 backdrop-blur rounded-md overflow-hidden divide-y divide-white/10">
              {suggestions.map(s => (
                <li key={s.id}>
                  <button
                    className="w-full flex items-center gap-4 text-left px-4 py-3 hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70"
                    onClick={() => {
                      router.push(`/products/${s.slug}`);
                      onClose();
                    }}
                  >
                    <div className="h-14 w-20 flex-shrink-0 rounded overflow-hidden bg-black/30 flex items-center justify-center">
                      {s.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.images[0].src} alt={s.images[0].alt || s.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate text-lg leading-snug">{s.title}</div>
                      <div className="text-xs uppercase tracking-wide text-white/50 mt-1">{s.category}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
