import React from 'react';

export const metadata = {
  title: 'Search | UCO Custom Calls',
  description: 'Search UCO Custom Calls products.'
};

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.toString() ?? '';
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>
      <form action="/search" method="get" className="mb-6 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
          className="flex-1 border rounded px-3 py-2"
          aria-label="Search products"
        />
        <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 focus:outline-none focus-visible:ring">
          Search
        </button>
      </form>
      {query ? (
        <p className="text-sm text-gray-600">No direct search index implemented yet. Placeholder results area for query: <strong>{query}</strong></p>
      ) : (
        <p className="text-sm text-gray-600">Enter a search term to begin.</p>
      )}
    </main>
  );
}
