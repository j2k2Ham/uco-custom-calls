import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SearchPage from './page';

// Simulate that localStorage already has recent searches
beforeEach(() => {
  localStorage.setItem('uco_recent_searches', JSON.stringify(['pintail', 'goose', 'lanyard']));
});

describe('SearchPage recent searches', () => {
  it('shows recent searches when no query and allows clicking to update URL', () => {
    render(<SearchPage searchParams={{ }} />);
    // Buttons for recent searches should appear
    expect(screen.getByRole('button', { name: 'pintail' })).toBeInTheDocument();
    // Click one to update state (cannot easily assert URL change in JSDOM but can assert input value updates)
    const pintailBtn = screen.getByRole('button', { name: 'pintail' });
    fireEvent.click(pintailBtn);
    // After click, the highlight logic would run on results, ensure at least one mark appears eventually
    const mark = screen.getAllByText((_, el) => el?.tagName.toLowerCase() === 'mark' && /pin/i.test(el.textContent || ''));
    expect(mark.length).toBeGreaterThan(0);
  });
});
