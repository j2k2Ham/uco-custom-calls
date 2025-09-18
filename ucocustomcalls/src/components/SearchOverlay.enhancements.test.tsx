import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Header } from './Header';
import { CartProvider } from '@/hooks/useCart';
import { UserProvider } from '@/hooks/useUser';
import { ToastProvider } from './ToastProvider';

function Wrapper() {
  return (
    <ToastProvider>
      <UserProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </UserProvider>
    </ToastProvider>
  );
}

describe('SearchOverlay enhancements', () => {
  it('highlights matched query text in suggestions', async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'pint' } });
    await waitFor(() => {
      const markEls = Array.from(document.querySelectorAll('mark')).filter(m => /pint/i.test(m.textContent||''));
      expect(markEls.length).toBeGreaterThan(0);
    });
  });

  it('supports keyboard navigation and Enter selects a suggestion', async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'canada' } });
    await waitFor(() => {
      const opts = screen.getAllByRole('option');
      expect(opts.some(b => /canada/i.test(b.textContent||''))).toBe(true);
    });
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // focus first suggestion
    fireEvent.keyDown(input, { key: 'Enter' }); // select it
    // Overlay should close (input gone)
    await waitFor(() => expect(screen.queryByPlaceholderText(/search the store/i)).toBeNull());
  });

  it('stores recent searches and displays them when input cleared', async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'pintail' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // Re-open overlay
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    await waitFor(() => expect(screen.getByText(/recent searches/i)).toBeInTheDocument());
    expect(screen.getByText(/pintail/i)).toBeInTheDocument();
  });

  it('dispatches analytics events for search_submit and suggestion_click', async () => {
    interface AnalyticsDetail { type: 'search_submit' | 'suggestion_click'; query?: string; slug?: string }
    const events: AnalyticsDetail[] = [];
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as AnalyticsDetail;
      events.push(detail);
    };
    window.addEventListener('analytics', handler);
    try {
      render(<Wrapper />);
      fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
      const input = screen.getByPlaceholderText(/search the store/i);
      fireEvent.change(input, { target: { value: 'pintail' } });
      await waitFor(() => {
        const opts = screen.getAllByRole('option');
        expect(opts.some(b => /pintail/i.test(b.textContent||''))).toBe(true);
      });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' }); // suggestion_click
      // reopen & submit search directly
      fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
      const input2 = screen.getByPlaceholderText(/search the store/i);
      fireEvent.change(input2, { target: { value: 'goose' } });
      fireEvent.keyDown(input2, { key: 'Enter' }); // search_submit
      await waitFor(() => expect(events.some(e => e.type === 'search_submit')).toBe(true));
      expect(events.some(e => e.type === 'suggestion_click')).toBe(true);
    } finally {
      window.removeEventListener('analytics', handler);
    }
  });

  it('applies ARIA listbox/option roles and updates aria-activedescendant', async () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: /search the store/i }));
    const input = screen.getByPlaceholderText(/search the store/i);
    fireEvent.change(input, { target: { value: 'pint' } });
    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });
    // Initially no active descendant
    expect(input).not.toHaveAttribute('aria-activedescendant');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await waitFor(() => {
      expect(input.getAttribute('aria-activedescendant')).toMatch(/^search-suggestion-/);
    });
    const activeId = input.getAttribute('aria-activedescendant')!;
    const activeEl = document.getElementById(activeId);
    expect(activeEl).toHaveAttribute('aria-selected', 'true');
  });
});
