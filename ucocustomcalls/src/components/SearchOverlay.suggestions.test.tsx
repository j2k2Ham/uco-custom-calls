import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Header } from './Header';
import { CartProvider } from '@/hooks/useCart';
import { UserProvider } from '@/hooks/useUser';
import { ToastProvider } from './ToastProvider';

function Wrapper() {
  return (
    <ToastProvider>
      <UserProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </UserProvider>
    </ToastProvider>
  );
}

describe('SearchOverlay suggestions', () => {
  it('shows debounced suggestions before Enter', async () => {
    render(<Wrapper />);
    const searchBtn = screen.getByRole('button', { name: /search the store/i });
    fireEvent.click(searchBtn);
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'pin' } });
    // Wait for debounce (~220ms) plus buffer
    await waitFor(() => {
      // The Pintail Acrylic should appear as suggestion (title case variant)
      expect(screen.getByText(/pintail acrylic/i)).toBeInTheDocument();
    }, { timeout: 1000 });
    // Overlay still open (input still present)
    expect(screen.getByPlaceholderText(/search the store/i)).toBeInTheDocument();
  });
});
