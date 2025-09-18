"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { searchProducts } from '@/lib/productStore';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps { open: boolean; onClose: () => void }

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchProducts>>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSubmitted(false);
      setActiveIndex(-1);
      // Load recent searches
      try {
        const raw = localStorage.getItem('uco_recent_searches');
        if (raw) setRecent(JSON.parse(raw));
      } catch {}
    }
  }, [open]);

  const commitSearch = useCallback((value: string) => {
    if (!value.trim()) return;
    // Save to recent
    try {
      const next = [value.trim(), ...recent.filter(r => r.toLowerCase() !== value.trim().toLowerCase())].slice(0,5);
      setRecent(next);
      localStorage.setItem('uco_recent_searches', JSON.stringify(next));
    } catch {}
    // analytics event (mock)
    window.dispatchEvent(new CustomEvent('analytics', { detail: { type: 'search_submit', query: value.trim() } }));
    searchProducts(value, 30); // warm cache
    setSubmitted(true);
    onClose();
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }, [recent, router, onClose]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') { onClose(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min((i === -1 ? 0 : i + 1), suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => {
        if (i <= 0) return -1; // back to input focus state
        return i - 1;
      });
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        // analytics suggestion_click
        window.dispatchEvent(new CustomEvent('analytics', { detail: { type: 'suggestion_click', slug: suggestions[activeIndex].slug, query } }));
        onClose();
        router.push(`/products/${suggestions[activeIndex].slug}`);
        return;
      }
      commitSearch(query);
    }
  };

  const onChange = (v: string) => {
    setQuery(v);
    setActiveIndex(-1);
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

  const highlight = (text: string) => {
    const q = query.trim();
    if (!q) return text;
    const parts = q.split(/\s+/).filter(Boolean).map(p => p.toLowerCase());
    if (!parts.length) return text;
    // Build a regex to split but we'll not rely on lastIndex mutation.
    const regex = new RegExp(`(${parts.map(p => p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`, 'ig');
    return text.split(regex).map((seg, i) => {
      const lower = seg.toLowerCase();
      const key = seg + '_' + i;
      if (parts.includes(lower)) {
        return <mark key={key} className="bg-brass/60 text-black px-0.5 rounded-sm">{seg}</mark>;
      }
      return <React.Fragment key={key}>{seg}</React.Fragment>;
    });
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
        {suggestions.length > 0 && !submitted && query.trim() !== '' && (
          <div className="mt-8 w-full max-w-2xl">
            <ul className="bg-black/40 backdrop-blur rounded-md overflow-hidden divide-y divide-white/10">
              {suggestions.map((s, idx) => (
                <li key={s.id}>
                  <button
                    className={`w-full flex items-center gap-4 text-left px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 ${idx === activeIndex ? 'bg-black/60' : 'hover:bg-black/50'}`}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('analytics', { detail: { type: 'suggestion_click', slug: s.slug, query } }));
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
                      <div className="font-medium truncate text-lg leading-snug">{highlight(s.title)}</div>
                      <div className="text-xs uppercase tracking-wide text-white/50 mt-1">{s.category}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {query.trim() === '' && recent.length > 0 && (
          <div className="mt-10 w-full max-w-md">
            <div className="text-white/60 text-xs uppercase tracking-wide mb-2">Recent Searches</div>
            <ul className="flex flex-wrap gap-2">
              {recent.map(r => (
                <li key={r}>
                  <button
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
                    onClick={() => commitSearch(r)}
                  >{r}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
