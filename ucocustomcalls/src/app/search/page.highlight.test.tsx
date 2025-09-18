import { render, screen } from '@testing-library/react';
import React from 'react';
import SearchPage from './page';

function renderWithQuery(q: string) {
  return render(<SearchPage searchParams={{ q }} />);
}

describe('SearchPage highlight', () => {
  it('wraps matching query fragments in <mark> for title and description', () => {
    renderWithQuery('pintail');
    const marks = screen.getAllByText((_, el) => el?.tagName.toLowerCase() === 'mark' && /pin/i.test(el.textContent || ''));
    expect(marks.length).toBeGreaterThan(0);
  });
});
