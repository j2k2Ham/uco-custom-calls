import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastProvider';

function KeysHarness() {
  const { push } = useToast();
  return (
    <div>
      <button onClick={() => { push('K1', { timeout: 1200 }); push('K2', { timeout: 1200 }); push('K3', { timeout: 1200 }); }}>seed</button>
    </div>
  );
}

describe('Toast keyboard navigation', () => {
  beforeEach(()=> vi.useFakeTimers());

  it('navigates and deletes focused toast', () => {
    render(<ToastProvider hoverMode="none"><KeysHarness /></ToastProvider>);
    fireEvent.click(screen.getByText('seed'));
    const region = screen.getByRole('group', { hidden: true }) || screen.getByText('K1').parentElement?.parentElement;
    // focus container
    (region as HTMLElement).focus();
    fireEvent.keyDown(region as HTMLElement, { key: 'ArrowDown' }); // focus first
    fireEvent.keyDown(region as HTMLElement, { key: 'ArrowDown' });
    fireEvent.keyDown(region as HTMLElement, { key: 'Delete' }); // delete second (K2)
    act(()=> { vi.advanceTimersByTime(300); });
    expect(screen.queryByText('K2')).toBeNull();
  });
});
