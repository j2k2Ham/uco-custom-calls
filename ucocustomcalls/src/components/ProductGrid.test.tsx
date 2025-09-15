import { render, screen } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/types';

function prod(id: string, title: string): Product {
  return {
    id, slug: id, title, description: 'd', category: 'duck', price: 1000,
    images: [{ src: '/x.jpg', alt: title }], inStock: true
  };
}

describe('ProductGrid', () => {
  it('renders multiple product cards', () => {
    const products = [prod('a','A'), prod('b','B'), prod('c','C')];
  render(<ProductGrid products={products} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
