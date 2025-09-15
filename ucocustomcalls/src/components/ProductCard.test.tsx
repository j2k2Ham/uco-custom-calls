import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

// Minimal inline shape matching usage in ProductCard
interface LocalProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: { src: string; alt: string }[];
  badges?: string[];
  inStock: boolean;
}

function makeProduct(overrides: Partial<LocalProduct> = {}): LocalProduct {
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
  render(<ul><ProductCard product={product as unknown as any} /></ul>);
    expect(screen.getByText('Product One')).toBeInTheDocument();
    expect(screen.getByText('$123.45')).toBeInTheDocument();
    expect(screen.getByText('Acrylic')).toBeInTheDocument();
    expect(screen.getByText('Single Reed')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/product-one');
  });

  it('handles no badges branch (empty render container)', () => {
  const product = makeProduct({ id: 'p2', slug: 'no-badges', title: 'No Badge', badges: undefined });
  render(<ul><ProductCard product={product as unknown as any} /></ul>);
    expect(screen.getByText('No Badge')).toBeInTheDocument();
    // Badge labels absent
    expect(screen.queryByText('Acrylic')).toBeNull();
  });
});
