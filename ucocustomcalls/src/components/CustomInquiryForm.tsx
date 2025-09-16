"use client";
import React from 'react';

export function CustomInquiryForm() {
  const [status, setStatus] = React.useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || 'Submission failed');
        setStatus('error');
        return;
      }
      // json.mailError means email dispatch failed but inquiry persisted; still show success.
      setStatus('success');
      form.reset();
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4" noValidate>
      <div className="grid gap-2">
        <label className="text-sm" htmlFor="name">Name</label>
        <input required id="name" name="name" placeholder="Name" className="bg-camo-light p-3 rounded" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm" htmlFor="email">Email</label>
        <input required id="email" type="email" name="email" placeholder="Email" className="bg-camo-light p-3 rounded" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm" htmlFor="message">Details</label>
        <textarea required id="message" name="message" rows={6} placeholder="Describe your custom call or lanyard" className="bg-camo-light p-3 rounded" />
      </div>
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="honey">Leave blank</label>
        <input id="honey" name="honey" tabIndex={-1} autoComplete="off" />
      </div>
      <button disabled={status==='submitting'} className="px-4 py-2 bg-brass text-black rounded-md disabled:opacity-60">
        {status==='submitting' ? 'Sending...' : 'Send Inquiry'}
      </button>
      {status==='success' && <p className="text-green-500 text-sm">Message sent. We typically respond within 24 hours.</p>}
      {status==='error' && <p className="text-red-400 text-sm">{error || 'Something went wrong.'}</p>}
    </form>
  );
}
