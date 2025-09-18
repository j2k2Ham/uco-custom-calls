import { screen, fireEvent } from '@testing-library/react';
import { AddToCartButton } from './AddToCartButton';
import { useCart } from '@/hooks/useCart';
import { renderWithProviders } from '@/test/providers';
import type { Product } from '@/types';
import React from 'react';

function CartCount() {
  const { count } = useCart();
  return <div data-testid="cart-count">{count}</div>;
}

const product: Product = {
  id: 'p-test',
  slug: 'p-test',
  title: 'Test Call',
  description: 'Desc',
  category: 'duck',
  priceCents: 2500,
  images: [{ src: '/x.jpg', alt: 'x' }],
  inStock: true
};

describe('AddToCartButton', () => {
  it('adds item and increments cart count', () => {
    renderWithProviders(<><AddToCartButton product={product} /><CartCount /></>);
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
  });
});
