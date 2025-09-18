import { ReactNode } from 'react';
import { CategoryPageFrameClient } from '@/components/CategoryPageFrameClient';

interface CategoryPageFrameProps { title: string; children: ReactNode; productCount?: number; activeHandle?: string; onSelectHandle?: (h: string)=>void; }

export function CategoryPageFrame(props: CategoryPageFrameProps) {
  const { title, children, productCount, activeHandle, onSelectHandle } = props;
  return (
    <div className="featured-bg category-bg-wrapper border-t border-camo-light/40 flex flex-col min-h-screen -mb-12 pb-12">
      <CategoryPageFrameClient title={title} productCount={productCount} activeHandle={activeHandle} onSelectHandle={onSelectHandle}>
        {children}
      </CategoryPageFrameClient>
    </div>
  );
}
