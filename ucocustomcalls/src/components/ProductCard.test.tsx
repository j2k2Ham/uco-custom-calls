import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

// Minimal inline shape matching usage in ProductCard
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    slug: 'product-one',
    title: 'Product One',
    description: 'Desc',
    category: 'duck',
    price: 12345,
    images: [{ src: '/img/one.jpg', alt: 'One' }],
    badges: ['Acrylic', 'Single Reed'],
    inStock: true,
    ...overrides
  };
}

describe('ProductCard', () => {
  it('renders product info and badges', () => {
  const product = makeProduct();
  render(<ul><ProductCard product={product} /></ul>);
    expect(screen.getByText('Product One')).toBeInTheDocument();
    expect(screen.getByText('$123.45')).toBeInTheDocument();
    expect(screen.getByText('Acrylic')).toBeInTheDocument();
    expect(screen.getByText('Single Reed')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/product-one');
  });

  it('handles no badges branch (empty render container)', () => {
  const product = makeProduct({ id: 'p2', slug: 'no-badges', title: 'No Badge', badges: undefined });
  render(<ul><ProductCard product={product} /></ul>);
    expect(screen.getByText('No Badge')).toBeInTheDocument();
    // Badge labels absent
    expect(screen.queryByText('Acrylic')).toBeNull();
  });
});
