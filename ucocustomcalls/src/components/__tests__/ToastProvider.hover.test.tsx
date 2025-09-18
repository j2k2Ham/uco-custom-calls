import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastProvider';

function Push({ mode }: { mode: 'extend' | 'pause' | 'none' }) {
  return (
    <ToastProvider hoverMode={mode} maxVisible={4} disableAutoDismissInTest={false}>
      <Inner />
    </ToastProvider>
  );
}
function Inner() {
  const { push } = useToast();
  return <button onClick={() => push('Hover', { timeout: 1000 })}>spawn</button>;
}

describe('Toast hover modes', () => {
  beforeEach(()=> vi.useFakeTimers());

  it('extend mode increases lifetime when hovered', () => {
    render(<Push mode="extend" />);
    fireEvent.click(screen.getByText('spawn'));
    const toast = screen.getByText('Hover');
    // advance half
    act(()=> { vi.advanceTimersByTime(600); });
    // hover triggers extension (+15%)
    fireEvent.mouseEnter(toast);
    // advance another original total span (1000ms)
    act(()=> { vi.advanceTimersByTime(1000); });
    // should still exist (extended)
    expect(screen.getByText('Hover')).toBeInTheDocument();
    act(()=> { vi.advanceTimersByTime(1200); }); // eventually expires
    act(()=> { vi.advanceTimersByTime(400); });
    expect(screen.queryByText('Hover')).toBeNull();
  });

  it('pause mode freezes remaining time while hovered', () => {
    render(<Push mode="pause" />);
    fireEvent.click(screen.getByText('spawn'));
    const toast = screen.getByText('Hover');
    act(()=> { vi.advanceTimersByTime(500); });
    fireEvent.mouseEnter(toast); // pause
    act(()=> { vi.advanceTimersByTime(2000); }); // should not dismiss while paused
    expect(screen.getByText('Hover')).toBeInTheDocument();
    fireEvent.mouseLeave(toast); // resume
    act(()=> { vi.advanceTimersByTime(600); }); // finishes remaining ~500 + buffer
    act(()=> { vi.advanceTimersByTime(400); });
    expect(screen.queryByText('Hover')).toBeNull();
  });

  it('none mode ignores hover', () => {
    render(<Push mode="none" />);
    fireEvent.click(screen.getByText('spawn'));
    const toast = screen.getByText('Hover');
    fireEvent.mouseEnter(toast);
    act(()=> { vi.advanceTimersByTime(1100); });
    act(()=> { vi.advanceTimersByTime(400); });
    expect(screen.queryByText('Hover')).toBeNull();
  });
});
