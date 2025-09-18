"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/products';

/**
 * Hero-style category buttons with active state highlighting.
 */
export function CategoryButtons({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  return (
    <div className={["flex flex-wrap gap-4", className].join(' ').trim()}>
      {CATEGORIES.map(cat => {
        const href = `/category/${cat.handle}`;
        const active = pathname === href;
        const base = 'px-5 py-2.5 rounded-md font-medium transition-colors';
        let style: string;
        if (cat.handle === 'duck') {
          style = active ? 'bg-brass text-black shadow-sm shadow-black/40' : 'bg-brass text-black/90 hover:shadow-md shadow-sm shadow-black/40';
        } else if (cat.handle === 'goose') {
          style = active ? 'border border-brass bg-brass/10' : 'border border-brass hover:bg-brass/10';
        } else if (cat.handle === 'accessories') {
          style = active ? 'border border-camo-light bg-camo-light/60' : 'border border-camo-light hover:bg-camo-light/60';
        } else {
          // lanyards / others
          style = active ? 'border border-camo-light bg-camo-light' : 'border border-camo-light hover:bg-camo-light';
        }
        return (
          <Link
            key={cat.handle}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={[base, style].join(' ')}
          >
            {cat.name.replace('Paracord ', '')}
          </Link>
        );
      })}
    </div>
  );
}
