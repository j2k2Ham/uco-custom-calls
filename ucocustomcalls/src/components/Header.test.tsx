import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { CartProvider } from '@/hooks/useCart';
import { UserProvider } from '@/hooks/useUser';
import React from 'react';
import { vi } from 'vitest';

// Mock CartDrawer to reduce render cost and speed up tests
vi.mock('./CartDrawer', () => ({
  CartDrawer: ({ open }: { open: boolean }) => (open ? <div data-testid="drawer-open" /> : null)
}));

function Wrapper() {
  return (
    <UserProvider>
      <CartProvider>
        <Header />
      </CartProvider>
    </UserProvider>
  );
}

describe('Header', () => {
  it('renders brand link and nav region', () => {
    render(<Wrapper />);
    expect(screen.getByRole('link', { name: /UCO Custom Calls/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/open cart/i)).toBeInTheDocument();
  });

  it('opens cart drawer when cart button clicked', () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByLabelText(/open cart/i));
    expect(screen.getByTestId('drawer-open')).toBeInTheDocument();
  });
});
