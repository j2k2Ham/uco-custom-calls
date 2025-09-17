import React from 'react';
import { UserProvider } from '@/hooks/useUser';
import { CartProvider } from '@/hooks/useCart';

export function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UserProvider>
  );
}
