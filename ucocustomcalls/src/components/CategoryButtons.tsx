"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/products';

/**
 * Hero-style category buttons with active state highlighting.
 */
type CategoryButtonsProps = {
  className?: string;
  currentPath?: string;
  activeHandle?: string;
  onSelect?: (handle: string) => void;
};

export function CategoryButtons({ className = '', currentPath, activeHandle, onSelect }: CategoryButtonsProps) {
  const hookPath = usePathname();
  const pathname = currentPath || hookPath;
  const controlled = Boolean(activeHandle && onSelect);
  return (
  <div className={["flex flex-wrap gap-4", className].join(' ').trim()} role={controlled ? 'tablist' : undefined}>
      {CATEGORIES.map(cat => {
        const href = `/category/${cat.handle}`;
        const active = activeHandle ? activeHandle === cat.handle : pathname === href;
  const base = 'px-5 py-2.5 rounded-md font-medium transition-colors transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 active:scale-[0.97]';
        let style: string;
        if (cat.handle === 'duck') {
          style = active ? 'bg-brass text-black shadow-sm shadow-black/40' : 'bg-brass text-black/90 hover:shadow-md shadow-sm shadow-black/40';
        } else if (cat.handle === 'goose') {
          style = active ? 'border border-brass bg-brass/15' : 'border border-brass hover:bg-brass/10 hover:scale-[1.03]';
        } else if (cat.handle === 'gear') {
          style = active ? 'border border-camo-light bg-camo-light/60' : 'border border-camo-light hover:bg-camo-light/60 hover:scale-[1.03]';
        } else {
          // lanyards / others
          style = active ? 'border border-camo-light bg-camo-light' : 'border border-camo-light hover:bg-camo-light hover:scale-[1.03]';
        }
        if (controlled) {
          return (
            <button
              type="button"
              key={cat.handle}
              onClick={() => onSelect && onSelect(cat.handle)}
              role="tab"
              aria-selected={active}
              aria-controls={`category-panel-${cat.handle}`}
              id={`category-tab-${cat.handle}`}
              className={[base, style, 'focus-visible:outline-none'].join(' ')}
            >
              {cat.name.replace('Paracord ', '')}
            </button>
          );
        } else {
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
        }
      })}
    </div>
  );
}
