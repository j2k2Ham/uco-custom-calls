import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ProfileMenu } from './ProfileMenu';
import { renderWithProviders } from '@/test/providers';
import userEvent from '@testing-library/user-event';

describe('ProfileMenu', () => {
  beforeEach(() => localStorage.clear());

  it('shows Login when logged out then shows account options after login', async () => {
  renderWithProviders(<ProfileMenu />);
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
  renderWithProviders(<ProfileMenu />);
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
  const { unmount } = renderWithProviders(<ProfileMenu />);
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
  renderWithProviders(<ProfileMenu />);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    expect(await screen.findByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
  });

  it('allows creating an account and shows first name next to icon', async () => {
    renderWithProviders(<ProfileMenu />);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
    await screen.findByRole('heading', { name: /login/i });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await screen.findByRole('heading', { name: /create account/i });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => {
      // Drawer closed; open menu again
      fireEvent.click(screen.getByLabelText(/account menu for jane doe|account menu/i));
    });
    // First name chip should be visible
    expect(screen.getByTestId('user-first-name').textContent).toBe('Jane');
  });

  it('prevents duplicate account creation', async () => {
    renderWithProviders(<ProfileMenu />);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
    await screen.findByRole('heading', { name: /login/i });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await screen.findByRole('heading', { name: /create account/i });
    // First creation
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => fireEvent.click(screen.getByLabelText(/account menu/i)));
    // Logout to attempt duplicate
    fireEvent.click(screen.getByRole('menuitem', { name: /logout/i }));
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
    await screen.findByRole('heading', { name: /login/i });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await screen.findByRole('heading', { name: /create account/i });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Johnny' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'another' } });
    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
    });
  });

  it('restores first name after logout and login using registry', async () => {
    renderWithProviders(<ProfileMenu />);
    const btn = screen.getByRole('button', { name: /account menu/i });
    await userEvent.click(btn);
    await userEvent.click(screen.getByRole('menuitem', { name: /login/i }));
    // Switch to create mode
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
  const firstNameField = screen.getByLabelText(/first name/i);
  const lastNameField = screen.getByLabelText(/last name/i);
  const emailFieldCreate = screen.getByLabelText(/email/i);
  const passwordFieldCreate = screen.getByLabelText(/password/i);
  await userEvent.clear(firstNameField); await userEvent.type(firstNameField, 'Alice');
  await userEvent.clear(lastNameField); await userEvent.type(lastNameField, 'Smith');
  await userEvent.clear(emailFieldCreate); await userEvent.type(emailFieldCreate, 'alice@example.com');
  await userEvent.clear(passwordFieldCreate); await userEvent.type(passwordFieldCreate, 'secret1');
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
    // Drawer closed; reopen menu to ensure inline first name rendered
    await userEvent.click(btn);
    expect(await screen.findByTestId('user-first-name')).toHaveTextContent('Alice');
    // Logout from menu
    await userEvent.click(screen.getByRole('menuitem', { name: /logout/i }));
    // Login again (no name fields this time)
    await userEvent.click(btn);
    await userEvent.click(screen.getByRole('menuitem', { name: /login/i }));
  const emailFieldLogin = screen.getByLabelText(/email/i);
  const passwordFieldLogin = screen.getByLabelText(/password/i);
  await userEvent.clear(emailFieldLogin); await userEvent.type(emailFieldLogin, 'alice@example.com');
  await userEvent.clear(passwordFieldLogin); await userEvent.type(passwordFieldLogin, 'abcd1');
    await userEvent.click(screen.getByRole('button', { name: /^login$/i }));
    // Reopen menu to see inline name again
    await userEvent.click(btn);
    expect(await screen.findByTestId('user-first-name')).toHaveTextContent('Alice');
  });

  it('shows validation error for short password on account creation', async () => {
    renderWithProviders(<ProfileMenu />);
    const btn = screen.getByRole('button', { name: /account menu/i });
    await userEvent.click(btn);
    await userEvent.click(screen.getByRole('menuitem', { name: /login/i }));
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    await userEvent.type(screen.getByLabelText(/first name/i), 'Bob');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Jones');
    await userEvent.type(screen.getByLabelText(/email/i), 'bob@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), '123'); // too short (<6)
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/password too short/i);
    // Ensure user was not logged in (no first name badge)
    expect(screen.queryByTestId('user-first-name')).toBeNull();
  });

  it('links My Account menu item to /account after login', async () => {
    renderWithProviders(<ProfileMenu />);
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
    await screen.findByRole('heading', { name: /login/i });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'linktest@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw1234' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
    await waitFor(() => fireEvent.click(screen.getByLabelText(/account menu/i)));
    const link = await screen.findByRole('menuitem', { name: /my account/i });
    expect(link).toHaveAttribute('href', '/account');
  });
});
