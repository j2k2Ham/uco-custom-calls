"use client";
import Image from 'next/image';
import React from 'react';

export function AccessoryContent() {
  const [status, setStatus] = React.useState<'idle'|'pending'|'success'|'error'>('idle');
  const [message, setMessage] = React.useState('');
  const formRef = React.useRef<HTMLFormElement | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'pending') return;
    const form = formRef.current;
    if (!form) return;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement | null;
    const email = emailInput?.value.trim();
    if (!email) return;
    setStatus('pending');
    setMessage('');
    try {
      const res = await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) {
        setStatus('success');
        setMessage('You are on the list. Watch your inbox.');
        form.reset();
      } else {
        const text = await res.text();
        setStatus('error');
        setMessage(text || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please retry.');
    }
  }

  return (
    <div className="mb-12 grid md:grid-cols-2 gap-8 items-center">
      <div>
  <p className="text-sky leading-relaxed">Enhance and maintain your waterfowl setup with our curated gear. From finishing tools and lanyard hardware to future call care kits, this collection extends the life and performance of your calls in the harshest marsh conditions.</p>
        <ul className="mt-4 space-y-2 text-sm text-sky/80 list-disc list-inside">
          <li>Hand-selected materials built for cold, wet hunts</li>
          <li>Future maintenance & tuning bundles (coming soon)</li>
          <li>Lightweight, packable, field-ready utility items</li>
        </ul>
        <p className="mt-4 text-sm text-sky/70">Inventory is expanding—check back as we add specialized tools and care components.</p>
        <div className="mt-6 p-4 border border-camo-light/60 rounded-md bg-camo/40 backdrop-blur-sm">
          <h2 className="font-semibold mb-2 text-lg">Stay Updated</h2>
          <p className="text-sm text-sky/80">Be the first to know when new maintenance kits and tuning tools drop.</p>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="mt-4 flex flex-col sm:flex-row gap-3"
            aria-label="Notify me when new gear is available"
            noValidate
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 px-3 py-2 rounded-md bg-black/40 border border-camo-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 placeholder:text-sky/40 text-sm disabled:opacity-50"
              aria-label="Email address"
              disabled={status==='pending'}
            />
            <button
              type="submit"
              disabled={status==='pending'}
              className="px-5 py-2.5 bg-brass text-black rounded-md font-medium shadow-sm shadow-black/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70 disabled:cursor-not-allowed disabled:opacity-70"
            >{status==='pending' ? 'Sending…' : 'Notify Me'}</button>
          </form>
          <div className="mt-3 min-h-[1.25rem] text-sm" aria-live="polite" role="status">
            {status==='success' && <span className="text-emerald-400">{message}</span>}
            {status==='error' && <span className="text-red-400">{message}</span>}
          </div>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden ring-1 ring-camo-light/40 shadow-md shadow-black/30">
        <Image
          src="/images/whh.jpg"
          alt="Gear display and lanyard hardware"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
      </div>
    </div>
  );
}
