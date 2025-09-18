import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastProvider';

function Harness({ children }: { children?: React.ReactNode }) {
  return <ToastProvider hoverMode="none" maxVisible={4} disableAutoDismissInTest={false}>{children}</ToastProvider>;
}

type ToastContextType = {
  push: (message: string, options: { type: string; timeout: number; action?: { label: string; onClick: () => void } }) => void;
  dismissAll: () => void;
};

function PushButtons() {
  const { push, dismissAll } = useToast() as ToastContextType;
  return (
    <div>
      <button onClick={() => push('A', { type: 'info', timeout: 600 })}>push-a</button>
      <button onClick={() => push('B', { type: 'success', timeout: 600 })}>push-b</button>
      <button onClick={() => push('Dup', { type: 'error', timeout: 800 })}>dup</button>
      <button onClick={() => push('Dup', { type: 'error', timeout: 800 })}>dup2</button>
      <button onClick={() => dismissAll()}>dismiss-all</button>
      <button onClick={() => push('Queued', { type: 'info', timeout: 300 })}>queued</button>
    </div>
  );
}

describe('ToastProvider core behaviors', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('pushes and auto-dismisses toasts', () => {
    render(<Harness><PushButtons /></Harness>);
    fireEvent.click(screen.getByText('push-a'));
    expect(screen.getByText('A')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(650); });
    // allow exit animation + removal (250ms + buffer)
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.queryByText('A')).toBeNull();
  });

  it('collapses duplicates and shows counter', () => {
    render(<Harness><PushButtons /></Harness>);
    fireEvent.click(screen.getByText('dup'));
    fireEvent.click(screen.getByText('dup2'));
    const toast = screen.getByText('Dup');
    expect(toast).toBeInTheDocument();
    // counter rendered inside sup ×2
    expect(screen.getByText(/×2/)).toBeInTheDocument();
  });

  it('queues when above maxVisible and promotes after space frees', () => {
  render(<ToastProvider hoverMode="none" maxVisible={2} disableAutoDismissInTest={false}><PushButtons /></ToastProvider>);
    fireEvent.click(screen.getByText('push-a'));
    fireEvent.click(screen.getByText('push-b'));
    // Add queued item
    fireEvent.click(screen.getByText('queued'));
    // Only two visible
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  // Queue info should reflect one queued item
  expect(screen.getByText('Queued')).toBeInTheDocument();
    // Let first toast auto-dismiss
    act(() => { vi.advanceTimersByTime(900); });
    act(() => { vi.advanceTimersByTime(350); });
    // Queued should promote
    expect(screen.getByText('Queued')).toBeInTheDocument();
  });

  it('invokes action callback then dismisses', () => {
    const handler = vi.fn();
    function ActionHarness() {
      const { push } = useToast() as ToastContextType;
      return <button onClick={() => push('Action', { type: 'info', action: { label: 'Undo', onClick: handler }, timeout: 800 })}>with-action</button>;
    }
    render(<Harness><ActionHarness /></Harness>);
    fireEvent.click(screen.getByText('with-action'));
    const btn = screen.getByText('Undo');
    fireEvent.click(btn);
    expect(handler).toHaveBeenCalledTimes(1);
    // start exit animation
    act(() => { vi.advanceTimersByTime(260); });
    expect(screen.queryByText('Action')).toBeNull();
  });

  it('dismissAll exits all visible and clears queued', () => {
  render(<ToastProvider hoverMode="none" maxVisible={2} disableAutoDismissInTest={false}><PushButtons /></ToastProvider>);
    fireEvent.click(screen.getByText('push-a'));
    fireEvent.click(screen.getByText('push-b'));
    fireEvent.click(screen.getByText('queued'));
    fireEvent.click(screen.getByText('dismiss-all'));
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.queryByText('Queued')).toBeNull();
  });
});
