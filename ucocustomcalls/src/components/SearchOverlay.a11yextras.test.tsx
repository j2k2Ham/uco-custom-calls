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

describe('SearchOverlay accessibility extras', () => {
  it('announces number of suggestions and active suggestion changes', async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'pint' } });
    await waitFor(() => {
      const live = screen.getByTestId('live-region');
      expect(live.textContent).toMatch(/suggestion/);
    });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await waitFor(() => {
      const live = screen.getByTestId('live-region');
      expect(live.textContent).toMatch(/suggestion 1 of/i);
    });
  });

  it('clear button resets query and suggestions and announces cleared', async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'goose' } });
    await waitFor(() => {
      expect(screen.getByTestId('live-region').textContent).toMatch(/suggestion/);
    });
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(input).toHaveValue('');
    await waitFor(() => {
      expect(screen.getByTestId('live-region').textContent).toMatch(/cleared/i);
    });
  });
});
