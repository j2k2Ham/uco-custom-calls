import { render, screen } from '@testing-library/react';
import React from 'react';
import SearchPage from './page';
import { vi } from 'vitest';

vi.mock('next/navigation', () => {
  // ensure no interference with existing global mock; provide minimal impl
  const push = vi.fn();
  return { useRouter: () => ({ push }) };
});

describe('/search page', () => {
  it('renders product results for a matching query', () => {
    render(<SearchPage searchParams={{ q: 'pintail' }} />);
    expect(screen.getByRole('heading', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/pintail acrylic/i)).toBeInTheDocument();
  });

  it('shows empty state when no query', () => {
    render(<SearchPage searchParams={{ }} />);
    expect(screen.getByText(/enter a term to search products/i)).toBeInTheDocument();
  });
});
