import { render, screen } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';

interface LocalProduct {
  id: string; slug: string; title: string; description: string; category: string; price: number;
  images: { src: string; alt: string }[]; badges?: string[]; inStock: boolean;
}

function prod(id: string, title: string): LocalProduct {
  return {
    id, slug: id, title, description: 'd', category: 'duck', price: 1000,
    images: [{ src: '/x.jpg', alt: title }], inStock: true
  };
}

describe('ProductGrid', () => {
  it('renders multiple product cards', () => {
    const products = [prod('a','A'), prod('b','B'), prod('c','C')];
  render(<ProductGrid products={products as unknown as any} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
