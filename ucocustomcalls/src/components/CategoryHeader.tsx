import { CategoryButtons } from '@/components/CategoryButtons';

export function CategoryHeader({ name }: { readonly name: string }) {
  return (
    <header className="mb-6">
      <div className="mb-6">
        <CategoryButtons />
      </div>
      <div className="mb-0 h-12 flex items-center">
        <h1 className="text-3xl font-semibold leading-tight">{name}</h1>
      </div>
    </header>
  );
}
