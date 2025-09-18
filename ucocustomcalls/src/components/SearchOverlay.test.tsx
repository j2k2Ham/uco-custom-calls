import { render, screen, fireEvent } from '@testing-library/react';
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

describe('SearchOverlay', () => {
  it('opens overlay and performs search on Enter', () => {
    render(<Wrapper />);
  const searchBtn = screen.getByRole('button', { name: /search the store/i });
    fireEvent.click(searchBtn);
  const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'pintail' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    // Result title should appear
    return screen.findAllByText(/pintail acrylic/i).then(nodes => {
      expect(nodes.length).toBeGreaterThan(0);
    });
  });
});
