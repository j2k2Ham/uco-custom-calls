"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
  timeout?: number;
}

interface ToastContextShape {
  push: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) => void;
}

const ToastCtx = createContext<ToastContextShape | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const push = useCallback((message: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, message, type: opts?.type || 'info', timeout: opts?.timeout ?? 4000 };
    setToasts(t => [...t, toast]);
    if (toast.timeout) {
      setTimeout(() => remove(id), toast.timeout);
    }
  }, [remove]);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} role="status" className={`rounded px-4 py-3 text-sm shadow bg-black/80 backdrop-blur border border-white/10 flex items-start gap-2 ${t.type === 'error' ? 'text-red-300' : t.type === 'success' ? 'text-green-300' : 'text-white'}`}> 
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be within ToastProvider');
  return ctx;
}
