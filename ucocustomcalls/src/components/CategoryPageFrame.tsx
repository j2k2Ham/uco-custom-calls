import { ReactNode } from 'react';
"use client";
import { CategoryButtons } from '@/components/CategoryButtons';
import { useEffect, useRef, useState } from 'react';

interface CategoryPageFrameProps { title: string; children: ReactNode; productCount?: number; activeHandle?: string; onSelectHandle?: (h: string)=>void; }

export function CategoryPageFrame({ title, children, productCount, activeHandle, onSelectHandle }: CategoryPageFrameProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [prevHandle, setPrevHandle] = useState<string | undefined>(activeHandle);
  useEffect(() => {
    if (activeHandle && prevHandle && activeHandle !== prevHandle) {
      headingRef.current?.focus();
    }
    setPrevHandle(activeHandle);
  }, [activeHandle, prevHandle]);
  return (
    <div className="featured-bg category-bg-wrapper border-t border-camo-light/40 flex flex-col min-h-screen -mb-12 pb-12">
      <section className="mx-auto max-w-6xl px-4 py-10 w-full">
        <div className="mb-6">
          <CategoryButtons activeHandle={activeHandle} onSelect={onSelectHandle} />
        </div>
        <div className="mb-2 h-12 flex items-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold leading-tight outline-none focus-visible:ring-2 focus-visible:ring-brass/60">{title}</h1>
        </div>
        <div aria-live="polite" className="sr-only" data-testid="category-count-announcement">
          {typeof productCount === 'number' ? `${productCount} item${productCount === 1 ? '' : 's'} shown in ${title} category` : ''}
        </div>
        <div id={activeHandle ? `category-panel-${activeHandle}` : undefined} role={activeHandle ? 'tabpanel' : undefined} aria-labelledby={activeHandle ? `category-tab-${activeHandle}` : undefined} className="fade-category-transition">
          {children}
        </div>
      </section>
    </div>
  );
}
