import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { UserProvider } from '@/hooks/useUser';
import { CartProvider } from '@/hooks/useCart';
import { ProfileMenu } from './ProfileMenu';

function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider><CartProvider>{children}</CartProvider></UserProvider>;
}

describe('ProfileMenu', () => {
  beforeEach(() => localStorage.clear());

  it('shows Login when logged out then shows account options after login', async () => {
    render(<Providers><ProfileMenu /></Providers>);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    const loginItem = await screen.findByRole('menuitem', { name: /login/i });
    expect(loginItem).toBeInTheDocument();
    fireEvent.click(loginItem);
  // Drawer should appear: locate heading role instead of generic text to avoid ambiguity
  await screen.findByRole('heading', { name: /login/i });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'passw' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
    await waitFor(() => expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument());
    // Re-open menu
    fireEvent.click(screen.getByLabelText(/account menu/i));
    expect(await screen.findByRole('menuitem', { name: /my account/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
  });

  it('can login with Google SSO', async () => {
    render(<Providers><ProfileMenu /></Providers>);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
  await screen.findByRole('heading', { name: /login/i });
    fireEvent.click(screen.getByRole('button', { name: /google/i }));
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText(/account menu/i));
      expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
    });
  });

  it('persists user session across reload (re-mount)', async () => {
    // First mount: login
    const { unmount } = render(<Providers><ProfileMenu /></Providers>);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
  await screen.findByRole('heading', { name: /login/i });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'persist@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw1234' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText(/account menu/i));
      expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
    });
    unmount();
    // Second mount: should load from storage
    render(<Providers><ProfileMenu /></Providers>);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    expect(await screen.findByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
  });
});
