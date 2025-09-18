import { render, screen } from '@testing-library/react';
import React from 'react';
import SearchPage from '../app/search/page';

describe('SearchPage highlight', () => {
  it('wraps matching query fragments in <mark> for title and description', () => {
    render(<SearchPage searchParams={{ q: 'pintail' }} />);
    const marks = screen.getAllByText((_, el) => el?.tagName.toLowerCase() === 'mark' && /pin/i.test(el.textContent || ''));
    expect(marks.length).toBeGreaterThan(0);
  });
});
