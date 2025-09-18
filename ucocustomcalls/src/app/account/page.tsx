import React from 'react';
import { useUser } from '@/hooks/useUser';
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
  const { user, updateProfile } = useUser();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);
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
      <form onSubmit={async e => { e.preventDefault(); setStatus('saving'); setError(null); try { await updateProfile({ firstName, lastName }); setStatus('saved'); setTimeout(()=>setStatus('idle'), 1500); } catch (err: any) { setError(err.message || 'Update failed'); setStatus('error'); } }} className="bg-camo-light/10 rounded p-4 border border-camo-light space-y-4">
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
      <div className="text-sm text-sky/70">Future enhancements: edit profile, change password, order history.</div>
      {currentFirst && <p className="text-sm">Welcome back, {currentFirst}! 🎯</p>}
    </div>
  );
}
