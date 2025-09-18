"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { searchProducts } from '@/lib/productStore';
import { useRouter } from 'next/navigation';
import { highlightTokens } from '@/lib/highlight';

interface SearchOverlayProps { open: boolean; onClose: () => void }

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchProducts>>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [liveMessage, setLiveMessage] = useState('');
  const lastAnnounceRef = useRef<string>('');
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
      setActiveIndex(i => {
        const next = Math.min((i === -1 ? 0 : i + 1), suggestions.length - 1);
        if (suggestions[next]) {
          const msg = `${suggestions[next].title}, suggestion ${next + 1} of ${suggestions.length}`;
          if (lastAnnounceRef.current !== msg) {
            lastAnnounceRef.current = msg;
            setLiveMessage(msg);
          }
        }
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => {
        if (i <= 0) return -1; // back to input focus state
        const next = i - 1;
        if (suggestions[next]) {
          const msg = `${suggestions[next].title}, suggestion ${next + 1} of ${suggestions.length}`;
          if (lastAnnounceRef.current !== msg) {
            lastAnnounceRef.current = msg;
            setLiveMessage(msg);
          }
        } else {
          if (lastAnnounceRef.current !== 'Input focus') {
            lastAnnounceRef.current = 'Input focus';
            setLiveMessage('Input focus');
          }
        }
        return next;
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
      setLiveMessage('');
      lastAnnounceRef.current = '';
      return;
    }
    const handle = setTimeout(() => {
      const found = searchProducts(query, 5);
      setSuggestions(found);
      setActiveIndex(-1);
      const msg = `${found.length} suggestion${found.length === 1 ? '' : 's'} for ${query}`;
      if (lastAnnounceRef.current !== msg) {
        lastAnnounceRef.current = msg;
        setLiveMessage(msg);
      }
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
            aria-autocomplete="list"
            aria-controls={suggestions.length > 0 ? 'search-suggestion-list' : undefined}
            aria-activedescendant={activeIndex >= 0 && suggestions[activeIndex] ? `search-suggestion-${suggestions[activeIndex].id}` : undefined}
            className="bg-transparent text-4xl font-medium tracking-wide outline-none placeholder:text-white/30 border-b-2 border-brass pb-3 transition-[width,padding] duration-300 ease-out w-[40%] min-w-[260px] focus:w-[65%] text-center font-semibold caret-white"
            style={{ maxWidth: '900px', paddingLeft: '0', paddingRight: '0' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); setActiveIndex(-1); setLiveMessage(''); setTimeout(() => setLiveMessage('Search cleared'), 10); }}
              aria-label="Clear search"
              className="absolute right-[18%] top-1/2 -translate-y-1/2 text-base px-2 py-1 rounded hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
            >×</button>
          )}
          {/* Invisible width balancer for center-grow illusion (optional future enhancement) */}
        </div>
        {suggestions.length > 0 && !submitted && query.trim() !== '' && (
          <div className="mt-8 w-full max-w-2xl" role="presentation">
            <ul id="search-suggestion-list" role="listbox" className="bg-black/40 backdrop-blur rounded-md overflow-hidden divide-y divide-white/10">
              {suggestions.map((s, idx) => (
                <li key={s.id} role="presentation">
                  <button
                    id={`search-suggestion-${s.id}`}
                    role="option"
                    aria-selected={idx === activeIndex}
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
                      <div className="font-medium truncate text-lg leading-snug">{highlightTokens(s.title, query)}</div>
                      <div className="text-xs uppercase tracking-wide text-white/50 mt-1">{s.category}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div aria-live="polite" className="sr-only" data-testid="live-region">{liveMessage}</div>
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
