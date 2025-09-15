import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartButton } from './AddToCartButton';
import { CartProvider, useCart } from '@/hooks/useCart';
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
  price: 2500,
  images: [{ src: '/x.jpg', alt: 'x' }],
  inStock: true
};

describe('AddToCartButton', () => {
  it('adds item and increments cart count', () => {
    render(
      <CartProvider>
        <AddToCartButton product={product} />
        <CartCount />
      </CartProvider>
    );
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
  });
});
