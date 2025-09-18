"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { signAuthCookie } from '@/lib/authCookie';

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
  updateProfile: (data: { firstName: string; lastName: string }) => Promise<User>;
  changePassword: (data: { current: string; next: string; confirm: string }) => Promise<void>;
}

const UserCtx = createContext<UserContextShape | null>(null);
const STORAGE_KEY = 'uco.user';
const USERS_KEY = 'uco.users'; // registry of created local users
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

  function loadUsers(): Record<string, User> {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) return JSON.parse(raw) as Record<string, User>;
    } catch { /* ignore */ }
    return {};
  }

  function persistUsers(map: Record<string, User>) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(map)); } catch { /* ignore */ }
  }

  function persist(next: User | null) {
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      (async () => {
        try {
          const payload = { id: next.id, email: next.email, name: next.name, provider: next.provider };
          const signed = await signAuthCookie(payload);
          const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
          document.cookie = `uco_auth=${signed}; Path=/; Expires=${expires}`;
        } catch { /* ignore */ }
      })();
    } else {
      localStorage.removeItem(STORAGE_KEY);
      try { document.cookie = 'uco_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'; } catch { /* ignore */ }
    }
  }

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    if (!SKIP_DELAY) await fakeDelay(300);
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setLoading(false); throw new Error('Invalid email'); }
    if (password.length < 4) { setLoading(false); throw new Error('Password too short'); }
    const users = loadUsers();
  const existing = users[email.toLowerCase()] as User | undefined;
  const next: User = existing ?? { id: `u_${btoa(email)}`, email, provider: 'local' };
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

  const updateProfile = useCallback(async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
    if (!user) throw new Error('Not authenticated');
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    if (!cleanFirst || !cleanLast) throw new Error('Name required');
    const updated: User = { ...user, name: `${cleanFirst} ${cleanLast}` };
    setUser(updated);
    persist(updated);
    // Update registry entry if local provider or existing email mapping
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      if (usersRaw && user.email) {
        const map = JSON.parse(usersRaw) as Record<string, User>;
        map[user.email.toLowerCase()] = updated;
        localStorage.setItem(USERS_KEY, JSON.stringify(map));
      }
    } catch { /* ignore */ }
    return updated;
  }, [user]);

  const createAccount = useCallback(async ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }): Promise<User> => {
    setLoading(true);
    if (!SKIP_DELAY) await fakeDelay(350);
    if (!firstName.trim() || !lastName.trim()) { setLoading(false); throw new Error('Name required'); }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setLoading(false); throw new Error('Invalid email'); }
    if (password.length < 6) { setLoading(false); throw new Error('Password too short'); }
    const users = loadUsers();
    if (users[email.toLowerCase()]) { setLoading(false); throw new Error('Account already exists'); }
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const next: User = { id: `u_${btoa(email)}`, email, name, provider: 'local' };
    users[email.toLowerCase()] = next;
    persistUsers(users);
    setUser(next); persist(next); setLoading(false); return next;
  }, []);

  const changePassword = useCallback(async ({ current, next, confirm }: { current: string; next: string; confirm: string }) => {
    if (!user) throw new Error('Not authenticated');
    // Dev stub: we do not actually store password, so just validate shape
    if (current.trim().length < 4) throw new Error('Current password invalid');
    if (next.trim().length < 6) throw new Error('New password too short');
    if (next !== confirm) throw new Error('Passwords do not match');
    if (current === next) throw new Error('New password must differ');
    // Pretend delay for UX realism (skipped in tests)
    if (!SKIP_DELAY) await fakeDelay(300);
    return; // success: nothing to persist in mock
  }, [user]);

  const value = useMemo(() => ({ user, loading, login, loginWithProvider, createAccount, logout, updateProfile, changePassword }), [user, loading, login, loginWithProvider, createAccount, logout, updateProfile, changePassword]);

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error('useUser must be within UserProvider');
  return ctx;
}
