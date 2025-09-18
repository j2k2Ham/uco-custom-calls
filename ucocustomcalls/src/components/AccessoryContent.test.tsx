import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccessoryContent } from './AccessoryContent';

// Mock fetch
const originalFetch = global.fetch;

describe('AccessoryContent', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => new Response('Subscribed', { status: 202 })) as unknown as typeof fetch;
  });

  it('submits email and shows success message', async () => {
    render(<AccessoryContent />);
    const input = screen.getByLabelText(/email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(screen.getByText(/you are on the list/i)).toBeInTheDocument();
    });
  });

  it('shows error on invalid email', async () => {
  global.fetch = vi.fn(async () => new Response('Invalid email', { status: 400 })) as unknown as typeof fetch;
    render(<AccessoryContent />);
    const input = screen.getByLabelText(/email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'bad' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(screen.getByText(/something went wrong|invalid email/i)).toBeTruthy();
    });
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });
});
