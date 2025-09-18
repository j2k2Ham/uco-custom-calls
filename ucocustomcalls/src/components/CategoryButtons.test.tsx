import { render, screen } from '@testing-library/react';
import { CategoryButtons } from './CategoryButtons';
import { describe, it, expect, vi } from 'vitest';
describe('CategoryButtons', () => {
  it('marks active category with aria-current="page"', () => {
    render(<CategoryButtons currentPath="/category/goose" />);
    const goose = screen.getByRole('link', { name: /goose calls/i });
    expect(goose).toHaveAttribute('aria-current', 'page');
    const duck = screen.getByRole('link', { name: /duck calls/i });
    expect(duck).not.toHaveAttribute('aria-current');
  });

  it('includes gear link', () => {
    render(<CategoryButtons currentPath="/" />);
    expect(screen.getByRole('link', { name: /gear/i })).toBeInTheDocument();
  });
});
