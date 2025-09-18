"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { searchProducts } from '@/lib/productStore';
import Link from 'next/link';

export const metadata = {
  title: 'Search | UCO Custom Calls',
  description: 'Search UCO Custom Calls products.'
};

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const initialQuery = searchParams?.q?.toString().trim() ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [recent, setRecent] = useState<string[]>([]);
  const results = query ? searchProducts(query, 60) : [];

  useEffect(() => {
    try {
      const raw = localStorage.getItem('uco_recent_searches');
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  // When initial query changes due to navigation, sync local state
  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const highlight = useCallback((text: string) => {
    const q = query.trim();
    if (!q) return text;
    const parts = q.split(/\s+/).filter(Boolean).map(p => p.toLowerCase());
    if (!parts.length) return text;
    const regex = new RegExp(`(${parts.map(p => p.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')).join('|')})`, 'ig');
    return text.split(regex).map((seg, i) => {
      const lower = seg.toLowerCase();
      if (parts.includes(lower)) {
        return <mark key={seg + '_' + i} className="bg-brass/60 text-black px-0.5 rounded-sm">{seg}</mark>;
      }
      return <React.Fragment key={seg + '_' + i}>{seg}</React.Fragment>;
    });
  }, [query]);

  const onRecentClick = (r: string) => {
    setQuery(r);
    // push into address bar via GET (client redirect)
    const params = new URLSearchParams();
    params.set('q', r);
    window.history.replaceState(null, '', `/search?${params.toString()}`);
  };

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <form action="/search" method="get" className="mb-10" onSubmit={(e) => {
        // store query to recent list (same logic as overlay commit)
        const form = e.currentTarget;
        const data = new FormData(form);
        const val = (data.get('q') || '').toString().trim();
        if (val) {
          try {
            const raw = localStorage.getItem('uco_recent_searches');
            const current = raw ? JSON.parse(raw) as string[] : [];
            const next = [val, ...current.filter(r => r.toLowerCase() !== val.toLowerCase())].slice(0,5);
            localStorage.setItem('uco_recent_searches', JSON.stringify(next));
            setRecent(next);
          } catch {}
        }
      }}>
        <input
          type="text"
          name="q"
          defaultValue={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="search the store"
          aria-label="Search products"
          className="w-full max-w-xl bg-transparent border-b-2 border-brass pb-2 text-2xl outline-none placeholder:text-black/40"
        />
      </form>
      {query === '' && recent.length === 0 && <p className="text-black/60">Enter a term to search products.</p>}
      {query === '' && recent.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 mb-3">Recent Searches</h2>
          <ul className="flex flex-wrap gap-2">
            {recent.map(r => (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => onRecentClick(r)}
                  className="px-3 py-1 rounded-full bg-black/5 hover:bg-black/10 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
                >{r}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {query !== '' && results.length === 0 && (
        <p className="text-black/60">No results for <span className="italic">{query}</span>.</p>
      )}
      {results.length > 0 && (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(p => (
            <li key={p.id} className="border border-black/10 rounded-md overflow-hidden hover:shadow-sm transition-shadow bg-white/40 backdrop-blur">
              <Link href={`/products/${p.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70">
                <div className="aspect-video w-full bg-black/5 flex items-center justify-center overflow-hidden">
                  {p.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].src} alt={p.images[0].alt || p.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{highlight(p.title)}</h2>
                  <p className="text-xs uppercase tracking-wide text-black/50 mb-2">{p.category}</p>
                  <p className="text-sm text-black/70 line-clamp-3">{highlight(p.description)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
