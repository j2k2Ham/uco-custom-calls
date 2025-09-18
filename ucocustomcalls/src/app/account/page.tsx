"use client";
import React from 'react';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/components/ToastProvider';
import Link from 'next/link';

export default function AccountPage() {
  // This is a client boundary because we need user context; if no user, show guidance.
  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <AccountContent />
    </div>
  );
}

function AccountContent() {
  const { user, updateProfile, changePassword } = useUser();
  const { push } = useToast();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  // Password change state (dev stub only)
  const [pwCurrent, setPwCurrent] = React.useState('');
  const [pwNext, setPwNext] = React.useState('');
  const [pwConfirm, setPwConfirm] = React.useState('');
  const [pwStatus, setPwStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pwError, setPwError] = React.useState<string | null>(null);
  const currentFirst = user?.name?.split(' ')[0];
  React.useEffect(() => {
    if (user?.name) {
      const [f, ...rest] = user.name.split(' ');
      setFirstName(f || '');
      setLastName(rest.join(' ') || '');
    }
  }, [user?.name]);
  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-sky/80">You are not logged in.</p>
        <p className="text-sm">Use the profile icon in the header to log in or create an account, then return here.</p>
        <Link href="/" className="underline text-sky hover:text-sky/80 text-sm">Go back home</Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="bg-camo-light/20 rounded p-4 border border-camo-light space-y-2">
        <h2 className="text-lg font-medium">Profile</h2>
        <div className="text-sm"><span className="font-semibold">Email:</span> {user.email}</div>
        {user.name && <div className="text-sm"><span className="font-semibold">Name:</span> {user.name}</div>}
        <div className="text-sm"><span className="font-semibold">Provider:</span> {user.provider ?? 'local'}</div>
      </div>
  <form onSubmit={async e => { e.preventDefault(); setStatus('saving'); setError(null); try { await updateProfile({ firstName, lastName }); setStatus('saved'); push('Profile updated', { type: 'success' }); setTimeout(()=>setStatus('idle'), 1500); } catch (err: unknown) { let msg = 'Update failed'; if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') { msg = (err as { message: string }).message; } setError(msg); push(msg, { type: 'error' }); setStatus('error'); } }} className="bg-camo-light/10 rounded p-4 border border-camo-light space-y-4">
        <h3 className="font-medium">Edit Name</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-first" className="block text-xs mb-1 uppercase tracking-wide">First</label>
            <input id="edit-first" value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full px-3 py-2 rounded bg-camo-light/30 border border-camo-light" />
          </div>
          <div>
            <label htmlFor="edit-last" className="block text-xs mb-1 uppercase tracking-wide">Last</label>
            <input id="edit-last" value={lastName} onChange={e=>setLastName(e.target.value)} className="w-full px-3 py-2 rounded bg-camo-light/30 border border-camo-light" />
          </div>
        </div>
        {error && <div className="text-sm text-red-400" role="alert">{error}</div>}
        <button type="submit" disabled={status==='saving'} className="bg-brass text-black rounded px-4 py-2 disabled:opacity-60">{status==='saving' ? 'Saving...' : 'Save Changes'}</button>
        {status === 'saved' && <span className="ml-3 text-sm text-green-400" role="status">Saved</span>}
      </form>
  <form onSubmit={async e => { e.preventDefault(); setPwStatus('saving'); setPwError(null); try { await changePassword({ current: pwCurrent, next: pwNext, confirm: pwConfirm }); setPwStatus('saved'); push('Password updated', { type: 'success' }); setTimeout(()=>setPwStatus('idle'), 1500); setPwCurrent(''); setPwNext(''); setPwConfirm(''); } catch (err: unknown) { const msg = err && typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string' ? (err as { message: string }).message : 'Change failed'; setPwError(msg); push(msg, { type: 'error' }); setPwStatus('error'); } }} className="bg-camo-light/10 rounded p-4 border border-camo-light space-y-4">
        <h3 className="font-medium">Change Password (Stub)</h3>
        <div className="grid gap-4">
          <div>
            <label htmlFor="pw-current" className="block text-xs mb-1 uppercase tracking-wide">Current Password</label>
            <input id="pw-current" type="password" value={pwCurrent} onChange={e=>setPwCurrent(e.target.value)} className="w-full px-3 py-2 rounded bg-camo-light/30 border border-camo-light" />
          </div>
          <div>
            <label htmlFor="pw-next" className="block text-xs mb-1 uppercase tracking-wide">New Password</label>
            <input id="pw-next" type="password" value={pwNext} onChange={e=>setPwNext(e.target.value)} className="w-full px-3 py-2 rounded bg-camo-light/30 border border-camo-light" />
          </div>
          <div>
            <label htmlFor="pw-confirm" className="block text-xs mb-1 uppercase tracking-wide">Confirm New Password</label>
            <input id="pw-confirm" type="password" value={pwConfirm} onChange={e=>setPwConfirm(e.target.value)} className="w-full px-3 py-2 rounded bg-camo-light/30 border border-camo-light" />
          </div>
        </div>
        {pwError && <div className="text-sm text-red-400" role="alert">{pwError}</div>}
        <button type="submit" disabled={pwStatus==='saving'} className="bg-brass text-black rounded px-4 py-2 disabled:opacity-60">{pwStatus==='saving' ? 'Changing...' : 'Change Password'}</button>
        {pwStatus === 'saved' && <span className="ml-3 text-sm text-green-400" role="status">Updated</span>}
        <p className="text-xs text-sky/60">This is a non-persistent demo; passwords are not stored.</p>
      </form>
      <div className="text-sm text-sky/70">Future enhancements: edit profile, change password, order history.</div>
      {currentFirst && <p className="text-sm">Welcome back, {currentFirst}! 🎯</p>}
    </div>
  );
}
