import { screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { renderWithProviders } from '@/test/providers';
import React from 'react';
import { vi } from 'vitest';

// Mock CartDrawer to reduce render cost and speed up tests
vi.mock('./CartDrawer', () => ({
  CartDrawer: ({ open }: { open: boolean }) => (open ? <div data-testid="drawer-open" /> : null)
}));


describe('Header', () => {
  it('renders brand link and nav region', () => {
  renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: /UCO Custom Calls/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/open cart/i)).toBeInTheDocument();
  });

  it('opens cart drawer when cart button clicked', () => {
  renderWithProviders(<Header />);
    fireEvent.click(screen.getByLabelText(/open cart/i));
    expect(screen.getByTestId('drawer-open')).toBeInTheDocument();
  });
});
