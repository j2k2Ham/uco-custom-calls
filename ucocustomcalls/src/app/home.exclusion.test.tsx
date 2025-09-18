import { render, screen, within } from '@testing-library/react';
import HomePage from './page';

// Basic structural test ensuring gear product (hat) not shown on homepage featured section.

describe('Home page featured products', () => {
  it('does not include Camo UCO Hat in featured grid', () => {
    render(<HomePage />);
    const featuredHeading = screen.getByRole('heading', { name: /featured/i });
    const section = featuredHeading.closest('section');
    expect(section).toBeTruthy();
    if (section) {
      const hat = within(section).queryByText(/Camo UCO Hat/i);
      expect(hat).toBeNull();
    }
  });
});
