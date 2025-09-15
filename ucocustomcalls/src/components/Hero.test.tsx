import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders headline, paragraph and category links', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { name: /Handcrafted Duck & Goose Calls/i })).toBeInTheDocument();
    expect(screen.getByText(/field-tested/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Shop Duck/i })).toHaveAttribute('href', '/category/duck');
    expect(screen.getByRole('link', { name: /Shop Goose/i })).toHaveAttribute('href', '/category/goose');
  });
});
