import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileMenu } from './ProfileMenu';
import AccountPage from '@/app/account/page';
import { renderWithProviders } from '@/test/providers';

// Integration-style test: create account, navigate to account page (render directly), edit name, ensure header updates.

describe('AccountPage profile editing', () => {
  beforeEach(() => localStorage.clear());

  it('updates name and reflects new first name in header', async () => {
    // Create account via ProfileMenu
    renderWithProviders(<>
      <ProfileMenu />
      <div data-testid="page-root"><AccountPage /></div>
    </>);
  await userEvent.click(screen.getByLabelText(/account menu/i));
  await userEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
    await screen.findByRole('heading', { name: /login/i });
  await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    await screen.findByRole('heading', { name: /create account/i });
  await userEvent.type(screen.getByLabelText(/first name/i), 'Temp');
  await userEvent.type(screen.getByLabelText(/last name/i), 'User');
  await userEvent.type(screen.getByLabelText(/^email$/i), 'tempuser@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'secret1');
  await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
  await userEvent.click(screen.getByLabelText(/account menu/i));
    expect(screen.getByTestId('user-first-name').textContent).toBe('Temp');

    // Now edit on account page
    // The account page should show existing name; edit fields are prefilled
    const firstInput = screen.getByLabelText(/first/i);
    const lastInput = screen.getByLabelText(/last/i);
  await userEvent.clear(firstInput); await userEvent.type(firstInput, 'Updated');
  await userEvent.clear(lastInput); await userEvent.type(lastInput, 'Name');
  await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
  // success indicator text appears
  await screen.findByText(/saved/i);

    // Header should reflect new first name (click menu to refresh inline text rendering if needed)
  await userEvent.click(screen.getByLabelText(/account menu/i));
    expect(screen.getByTestId('user-first-name').textContent).toBe('Updated');
  });
  it('changes password successfully (stub)', async () => {
    // Seed user directly
    localStorage.setItem('uco.user', JSON.stringify({ id: 'u_pw', email: 'pw@example.com', provider: 'local', name: 'Pw User' }));
    renderWithProviders(<AccountPage />);
    await userEvent.type(await screen.findByLabelText(/^current password$/i), 'oldpw');
    await userEvent.type(screen.getByLabelText(/^new password$/i), 'newpw123');
    await userEvent.type(screen.getByLabelText(/^confirm new password$/i), 'newpw123');
  await userEvent.click(screen.getByRole('button', { name: /change password/i }));
  expect(await screen.findByText(/updated/i)).toBeInTheDocument();
  });

  it('validates password change errors', async () => {
    localStorage.setItem('uco.user', JSON.stringify({ id: 'u_pw2', email: 'err@example.com', provider: 'local', name: 'Err User' }));
    renderWithProviders(<AccountPage />);
    await userEvent.type(await screen.findByLabelText(/^current password$/i), 'abc');
    await userEvent.type(screen.getByLabelText(/^new password$/i), 'abcdef');
    await userEvent.type(screen.getByLabelText(/^confirm new password$/i), 'abcdef');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/current password invalid/i);
    // Fix current but mismatch next/confirm
    const currentField = screen.getByLabelText(/^current password$/i);
    await userEvent.clear(currentField); await userEvent.type(currentField, 'oldpw');
    const nextField = screen.getByLabelText(/^new password$/i);
    const confirmField = screen.getByLabelText(/^confirm new password$/i);
    await userEvent.clear(nextField); await userEvent.type(nextField, 'abcdef');
    await userEvent.clear(confirmField); await userEvent.type(confirmField, 'abcdeg');
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/match/i);
    // Same as current
  // Use sufficiently long password to bypass length check and hit "must differ" rule
    const longCurrent = 'CurrentPassword123';
    await userEvent.clear(currentField); await userEvent.type(currentField, longCurrent);
    await userEvent.clear(nextField); await userEvent.type(nextField, longCurrent);
    await userEvent.clear(confirmField); await userEvent.type(confirmField, longCurrent);
    await userEvent.click(screen.getByRole('button', { name: /change password/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/must differ/i);
  });
});
