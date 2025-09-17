"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

export type User = {
  id: string;
  email: string;
  name?: string;
  provider?: 'local' | 'google' | 'facebook';
};

interface UserContextShape {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithProvider: (provider: 'google' | 'facebook') => Promise<User>;
  createAccount: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<User>;
  logout: () => void;
}

const UserCtx = createContext<UserContextShape | null>(null);
const STORAGE_KEY = 'uco.user';
const SKIP_DELAY = typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_AUTH_DELAY === '0');

function fakeDelay(ms: number) {
  if (SKIP_DELAY) return Promise.resolve();
  return new Promise(res => setTimeout(res, ms));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        if (parsed && typeof parsed.id === 'string') setUser(parsed);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function persist(next: User | null) {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    if (!SKIP_DELAY) await fakeDelay(300);
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setLoading(false); throw new Error('Invalid email'); }
    if (password.length < 4) { setLoading(false); throw new Error('Password too short'); }
    const next: User = { id: `u_${btoa(email)}`, email, provider: 'local' };
    setUser(next); persist(next); setLoading(false); return next;
  }, []);

  const loginWithProvider = useCallback(async (provider: 'google' | 'facebook'): Promise<User> => {
    setLoading(true);
    if (!SKIP_DELAY) await fakeDelay(400);
    const email = provider === 'google' ? 'user@google.example' : 'user@facebook.example';
    const next: User = { id: `u_${provider}_${Date.now()}`, email, provider };
    setUser(next); persist(next); setLoading(false); return next;
  }, []);

  const logout = useCallback(() => {
    setUser(null); persist(null);
  }, []);

  const createAccount = useCallback(async ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }): Promise<User> => {
    setLoading(true);
    if (!SKIP_DELAY) await fakeDelay(350);
    if (!firstName.trim() || !lastName.trim()) { setLoading(false); throw new Error('Name required'); }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setLoading(false); throw new Error('Invalid email'); }
    if (password.length < 6) { setLoading(false); throw new Error('Password too short'); }
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const next: User = { id: `u_${btoa(email)}`, email, name, provider: 'local' };
    setUser(next); persist(next); setLoading(false); return next;
  }, []);

  const value = useMemo(() => ({ user, loading, login, loginWithProvider, createAccount, logout }), [user, loading, login, loginWithProvider, createAccount, logout]);

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error('useUser must be within UserProvider');
  return ctx;
}
