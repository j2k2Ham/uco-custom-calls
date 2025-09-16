"use client";
import React, { useEffect, useState } from 'react';

// Simple theme toggle manipulating the root <html> class list.
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggle = () => {
    setDark(d => {
      const next = !d;
      if (next) {
        document.documentElement.classList.add('dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  if (!mounted) return null; // avoid hydration mismatch

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Activate light mode' : 'Activate dark mode'}
      className={`rounded-md px-3 py-1 text-sm font-medium border border-camo-light hover:bg-camo-light transition ${className}`}
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
