import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
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
    fireEvent.click(screen.getByLabelText(/account menu/i));
    fireEvent.click(await screen.findByRole('menuitem', { name: /login/i }));
    await screen.findByRole('heading', { name: /login/i });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await screen.findByRole('heading', { name: /create account/i });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Temp' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'tempuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => fireEvent.click(screen.getByLabelText(/account menu/i)));
    expect(screen.getByTestId('user-first-name').textContent).toBe('Temp');

    // Now edit on account page
    // The account page should show existing name; edit fields are prefilled
    const firstInput = screen.getByLabelText(/first/i);
    const lastInput = screen.getByLabelText(/last/i);
    fireEvent.change(firstInput, { target: { value: 'Updated' } });
    fireEvent.change(lastInput, { target: { value: 'Name' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
  await screen.findByText(/saved/i);

    // Header should reflect new first name (click menu to refresh inline text rendering if needed)
    fireEvent.click(screen.getByLabelText(/account menu/i));
    expect(screen.getByTestId('user-first-name').textContent).toBe('Updated');
  });
});
