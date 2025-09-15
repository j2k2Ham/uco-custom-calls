import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders brand and links', () => {
    render(<Footer />);
    const brandTexts = screen.getAllByText(/UCO Custom Calls/i);
    expect(brandTexts.length).toBeGreaterThanOrEqual(1); // brand plus copyright line
    expect(screen.getByRole('link', { name: /About/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /Custom Calls/i })).toHaveAttribute('href', '/custom');
    expect(screen.getByRole('link', { name: /Contact/i })).toHaveAttribute('href', '/contact');
  });
});
