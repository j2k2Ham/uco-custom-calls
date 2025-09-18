import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import SearchPage from '../app/search/page';

beforeEach(() => {
  localStorage.setItem('uco_recent_searches', JSON.stringify(['pintail', 'goose', 'lanyard']));
});

describe('SearchPage recent searches', () => {
  it('shows recent searches when no query and clicking one triggers highlighted results', async () => {
    render(<SearchPage searchParams={{ }} />);
    expect(screen.getByRole('button', { name: 'pintail' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'pintail' }));
    await waitFor(() => {
      const marks = screen.getAllByText((_, el) => el?.tagName.toLowerCase() === 'mark' && /pin/i.test(el.textContent || ''));
      expect(marks.length).toBeGreaterThan(0);
    });
  });
});
