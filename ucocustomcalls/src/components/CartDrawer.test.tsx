import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { CartProvider, useCart } from '@/hooks/useCart';
import type { Product } from '@/types';
import React from 'react';

const product: Product = {
  id: 'cd-1', slug: 'cd-1', title: 'Drawer Item', description: 'Desc', category: 'duck', price: 1500,
  images: [{ src: '/i.jpg', alt: 'i' }], inStock: true
};

function Setup({ open = true }: { open?: boolean }) {
  const { add } = useCart();
  React.useEffect(() => { add(product); }, [add]);
  return <CartDrawer open={open} onClose={() => {}} />;
}

function Wrapper() {
  return (
    <CartProvider>
      <Setup />
    </CartProvider>
  );
}

describe('CartDrawer', () => {
  it('renders added item and subtotal', async () => {
    render(<Wrapper />);
    expect(await screen.findByText('Drawer Item')).toBeInTheDocument();
    expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
  });

  it('removes item when Remove clicked', async () => {
    render(<Wrapper />);
    const removeBtn = await screen.findByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument();
  });
});
