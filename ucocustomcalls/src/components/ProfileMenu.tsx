"use client";
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/components/ToastProvider';
import { Dialog } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function ProfileMenu() {
  const { user, logout } = useUser();
  const { push } = useToast();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'login' | 'create'>('login');

  return (
    <>
      <div className="relative">
        <button aria-haspopup="menu" aria-expanded={menuOpen} aria-label={user ? `Account menu for ${user.name || user.email}` : 'Account menu'} onClick={() => setMenuOpen(o=>!o)} className="p-2 rounded-md hover:bg-camo-light flex items-center gap-2">
          <UserCircleIcon className="w-6 h-6" />
          {user?.name && <span className="text-sm max-w-[8rem] truncate" data-testid="user-first-name">{user.name.split(' ')[0]}</span>}
        </button>
        {menuOpen && (
          <ul role="menu" className="absolute top-full left-0 mt-2 w-52 bg-camo border border-camo-light rounded shadow-lg py-2 z-50">
            {!user && (
              <li>
                <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-camo-light" onClick={() => { setMode('login'); setMenuOpen(false); setLoginOpen(true); }}>Login</button>
              </li>
            )}
            {user && (
              <>
                <li className="px-3 pb-2 pt-1 text-xs uppercase tracking-wide text-sky/70" role="presentation">Welcome{user.name ? `, ${user.name.split(' ')[0]}` : ''}</li>
                <li>
                  <Link href="/account" role="menuitem" className="block w-full text-left px-3 py-2 hover:bg-camo-light" onClick={() => setMenuOpen(false)}>My Account</Link>
                </li>
                <li>
                  <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-camo-light" onClick={() => { logout(); push('Logged out', { type: 'info' }); setMenuOpen(false); }}>Logout</button>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
  <LoginDrawer mode={mode} setMode={(m)=>{ setMode(m); if(!loginOpen) setLoginOpen(true); }} open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

function LoginDrawer({ open, onClose, mode, setMode }: { open: boolean; onClose: () => void; mode: 'login' | 'create'; setMode: (m: 'login' | 'create') => void }) {
  const { login, loginWithProvider, createAccount, loading } = useUser();
  const { push } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
        push('Logged in', { type: 'success' });
      } else {
        await createAccount({ firstName, lastName, email, password });
        push('Account created', { type: 'success' });
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      push(msg, { type: 'error' });
    }
  }

  async function handleProvider(provider: 'google' | 'facebook') {
    setError(null);
    try { await loginWithProvider(provider); push('Logged in with ' + provider, { type: 'success' }); onClose(); } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'SSO failed'; setError(msg); push(msg, { type: 'error' }); }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-camo p-6 shadow-2xl flex flex-col">
        <Dialog.Title className="text-lg font-semibold">{mode === 'login' ? 'Login' : 'Create Account'}</Dialog.Title>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === 'create' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="create-first" className="block text-sm mb-1">First Name</label>
                <input id="create-first" value={firstName} onChange={e=>setFirstName(e.target.value)} required className="w-full px-3 py-2 rounded bg-camo-light/40 border border-camo-light" />
              </div>
              <div>
                <label htmlFor="create-last" className="block text-sm mb-1">Last Name</label>
                <input id="create-last" value={lastName} onChange={e=>setLastName(e.target.value)} required className="w-full px-3 py-2 rounded bg-camo-light/40 border border-camo-light" />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm mb-1">Email</label>
            <input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-camo-light/40 border border-camo-light" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm mb-1">Password</label>
            <input id="login-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-camo-light/40 border border-camo-light" />
          </div>
          {error && <div className="text-sm text-red-400" role="alert">{error}</div>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-brass text-black rounded-md px-4 py-2 disabled:opacity-60">{loading ? '...' : (mode === 'login' ? 'Login' : 'Create')}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
          </div>
          <div className="text-right text-sm">
            {mode === 'login' ? (
              <button type="button" className="underline text-sky hover:text-sky/80" onClick={()=>{setMode('create'); setError(null);}}>Create account</button>
            ) : (
              <button type="button" className="underline text-sky hover:text-sky/80" onClick={()=>{setMode('login'); setError(null);}}>Back to login</button>
            )}
          </div>
        </form>
        {mode === 'login' && (
          <div className="mt-6 space-y-3">
            <div className="text-xs uppercase tracking-wide text-sky/70">Or continue with</div>
            <div className="flex gap-3">
              <button onClick={()=>handleProvider('google')} disabled={loading} className="flex-1 px-3 py-2 rounded border border-camo-light hover:bg-camo-light/40 disabled:opacity-60">Google</button>
              <button onClick={()=>handleProvider('facebook')} disabled={loading} className="flex-1 px-3 py-2 rounded border border-camo-light hover:bg-camo-light/40 disabled:opacity-60">Facebook</button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
