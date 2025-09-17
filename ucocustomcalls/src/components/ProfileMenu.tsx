"use client";
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { Dialog } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export function ProfileMenu() {
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);

  return (
    <>
      <div className="relative">
        <button aria-haspopup="menu" aria-expanded={menuOpen} aria-label="Account menu" onClick={() => setMenuOpen(o=>!o)} className="p-2 rounded-md hover:bg-camo-light">
          <UserCircleIcon className="w-6 h-6" />
        </button>
        {menuOpen && (
          <ul role="menu" className="absolute right-0 mt-2 w-44 bg-camo border border-camo-light rounded shadow-lg py-1 z-50">
            {!user && (
              <li>
                <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-camo-light" onClick={() => { setMenuOpen(false); setLoginOpen(true); }}>Login</button>
              </li>
            )}
            {user && (
              <>
                <li>
                  <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-camo-light" onClick={() => { setMenuOpen(false); /* future account page */ }}>My Account</button>
                </li>
                <li>
                  <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-camo-light" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
      <LoginDrawer open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

function LoginDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, loginWithProvider, loading } = useUser();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  async function handleProvider(provider: 'google' | 'facebook') {
    setError(null);
    try { await loginWithProvider(provider); onClose(); } catch (e: any) { setError(e.message || 'SSO failed'); }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-camo p-6 shadow-2xl flex flex-col">
        <Dialog.Title className="text-lg font-semibold">Login</Dialog.Title>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
            <button type="submit" disabled={loading} className="flex-1 bg-brass text-black rounded-md px-4 py-2 disabled:opacity-60">{loading ? '...' : 'Login'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
          </div>
        </form>
        <div className="mt-6 space-y-3">
          <div className="text-xs uppercase tracking-wide text-sky/70">Or continue with</div>
          <div className="flex gap-3">
            <button onClick={()=>handleProvider('google')} disabled={loading} className="flex-1 px-3 py-2 rounded border border-camo-light hover:bg-camo-light/40 disabled:opacity-60">Google</button>
            <button onClick={()=>handleProvider('facebook')} disabled={loading} className="flex-1 px-3 py-2 rounded border border-camo-light hover:bg-camo-light/40 disabled:opacity-60">Facebook</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
