import React from 'react';
import { searchProducts } from '@/lib/productStore';
import Link from 'next/link';

export const metadata = {
  title: 'Search | UCO Custom Calls',
  description: 'Search UCO Custom Calls products.'
};

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.toString().trim() ?? '';
  const results = query ? searchProducts(query, 60) : [];

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <form action="/search" method="get" className="mb-10">
        <input
          type="text"
            name="q"
            defaultValue={query}
            placeholder="search the store"
            aria-label="Search products"
            className="w-full max-w-xl bg-transparent border-b-2 border-brass pb-2 text-2xl outline-none placeholder:text-black/40"
        />
      </form>
      {query === '' && <p className="text-black/60">Enter a term to search products.</p>}
      {query !== '' && results.length === 0 && (
        <p className="text-black/60">No results for <span className="italic">{query}</span>.</p>
      )}
      {results.length > 0 && (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(p => (
            <li key={p.id} className="border border-black/10 rounded-md p-4 hover:shadow-sm transition-shadow">
              <Link href={`/products/${p.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70">
                <h2 className="font-semibold text-lg mb-1">{p.title}</h2>
                <p className="text-xs uppercase tracking-wide text-black/50 mb-2">{p.category}</p>
                <p className="text-sm text-black/70 line-clamp-3">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
