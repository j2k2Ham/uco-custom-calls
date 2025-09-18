import React from 'react';
import { UserProvider } from '@/hooks/useUser';
import { CartProvider } from '@/hooks/useCart';
import { ToastProvider } from '@/components/ToastProvider';
import { RenderOptions, render } from '@testing-library/react';

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <UserProvider>
        <CartProvider>
          <ToastProvider hoverMode="none" maxVisible={6}>{children}</ToastProvider>
        </CartProvider>
      </UserProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
