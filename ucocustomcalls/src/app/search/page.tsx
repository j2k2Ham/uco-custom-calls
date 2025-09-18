import React from 'react';
import SearchContent from './SearchContent';

export const metadata = {
  title: 'Search | UCO Custom Calls',
  description: 'Search UCO Custom Calls products.'
};

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const initialQuery = searchParams?.q?.toString().trim() ?? '';
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <SearchContent initialQuery={initialQuery} />
    </main>
  );
}
