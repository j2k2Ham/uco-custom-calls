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
      const matches = screen.getAllByText((_, el) => !!el && /pintail acrylic/i.test(el.textContent || ''));
      expect(matches.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
    // Image thumbnail should be present (role img)
    expect(screen.getByRole('img', { name: /pintail/i })).toBeInTheDocument();
    // Overlay still open (input still present)
    expect(screen.getByPlaceholderText(/search the store/i)).toBeInTheDocument();
  });
});
