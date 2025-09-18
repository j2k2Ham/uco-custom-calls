import { render, screen } from '@testing-library/react';
import React from 'react';
import SearchPage from './page';

describe('SearchPage thumbnails', () => {
  it('renders image thumbnail for a result', () => {
    render(<SearchPage searchParams={{ q: 'pintail' }} />);
    const img = screen.getByRole('img', { name: /pintail/i });
    expect(img).toBeInTheDocument();
  });
});
