import React from 'react';
import { UserProvider } from '@/hooks/useUser';
import { CartProvider } from '@/hooks/useCart';
import { RenderOptions, render } from '@testing-library/react';

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <UserProvider>
        <CartProvider>{children}</CartProvider>
      </UserProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
