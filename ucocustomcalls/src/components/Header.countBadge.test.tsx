import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { Header } from './Header';
import { UserProvider } from '@/hooks/useUser';

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({ open: false, setOpen: () => {}, count: 3 }),
}));

vi.mock('./CartDrawer', () => ({
  CartDrawer: () => null,
}));

describe('Header count badge', () => {
  it('renders badge when count > 0', () => {
  render(<UserProvider><Header /></UserProvider>);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
