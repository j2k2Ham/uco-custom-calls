import { ReactNode } from 'react';
import { CategoryButtons } from '@/components/CategoryButtons';

interface CategoryPageFrameProps {
  title: string;
  children: ReactNode;
}

export function CategoryPageFrame({ title, children }: CategoryPageFrameProps) {
  return (
    <div className="featured-bg category-bg-wrapper border-t border-camo-light/40 flex flex-col min-h-screen -mb-12 pb-12">
      <section className="mx-auto max-w-6xl px-4 py-10 w-full">
        <div className="mb-6">
          <CategoryButtons />
        </div>
        <div className="mb-6 h-12 flex items-center">
          <h1 className="text-3xl font-semibold leading-tight">{title}</h1>
        </div>
        {children}
      </section>
    </div>
  );
}
