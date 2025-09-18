import React from 'react';
import SearchContent from './SearchContent';

export const metadata = {
  title: 'Search | UCO Custom Calls',
  description: 'Search UCO Custom Calls products.'
};

export default async function SearchPage(props: { searchParams?: Promise<{ q?: string }> }) {
  const sp = props.searchParams ? await props.searchParams : undefined;
  const initialQuery = sp?.q?.toString().trim() ?? '';
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <SearchContent initialQuery={initialQuery} />
    </main>
  );
}
