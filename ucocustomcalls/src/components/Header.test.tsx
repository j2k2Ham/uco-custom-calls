import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { CartProvider } from '@/hooks/useCart';
import React from 'react';

function Wrapper() {
  return (
    <CartProvider>
      <Header />
    </CartProvider>
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
    // Mocked Dialog should appear
    expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
  });
});
