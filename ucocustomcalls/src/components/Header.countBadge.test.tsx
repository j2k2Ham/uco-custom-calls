import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { Header } from './Header';
import { renderWithProviders } from '@/test/providers';

vi.mock('@/hooks/useCart', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- test partial mock
  const actualMod: any = await importOriginal();
  const originalUseCart = actualMod.useCart;
  return {
    ...actualMod,
    useCart: () => ({ ...originalUseCart(), open: false, setOpen: () => {}, count: 3 }),
  };
});

vi.mock('./CartDrawer', () => ({
  CartDrawer: () => null,
}));

describe('Header count badge', () => {
  it('renders badge when count > 0', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
