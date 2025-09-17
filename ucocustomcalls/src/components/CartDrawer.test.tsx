import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { CartProvider, useCart } from '@/hooks/useCart';
import { UserProvider } from '@/hooks/useUser';
import type { Product } from '@/types';
import React from 'react';

const product: Product = {
  id: 'cd-1', slug: 'cd-1', title: 'Drawer Item', description: 'Desc', category: 'duck', priceCents: 1500,
  images: [{ src: '/i.jpg', alt: 'i' }], inStock: true
};

function Setup({ open = true }: Readonly<{ open?: boolean }>) {
  const { add } = useCart();
  const addedRef = React.useRef(false);
  React.useEffect(() => {
    if (!addedRef.current) {
      add(product);
      addedRef.current = true;
    }
  }, [add]);
  return <CartDrawer open={open} onClose={() => {}} />;
}

function Wrapper() {
  return (
    <UserProvider>
      <CartProvider>
        <Setup />
      </CartProvider>
    </UserProvider>
  );
}

describe('CartDrawer', () => {
  it('renders added item and subtotal', async () => {
    render(<Wrapper />);
    await waitFor(() => expect(screen.getByText('Drawer Item')).toBeInTheDocument());
    expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
  const prices = screen.getAllByText('$15.00');
  expect(prices.length).toBeGreaterThanOrEqual(2); // line item + subtotal
  });

  it('removes item when Remove clicked', async () => {
    render(<Wrapper />);
  const removeBtn = await screen.findByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
  });
});
