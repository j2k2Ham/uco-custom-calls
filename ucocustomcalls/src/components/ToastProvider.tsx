"use client";
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
  timeout?: number;
  action?: ToastAction;
}

interface ToastContextShape {
  push: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) => void;
  dismissAll: () => void;
}

const ToastCtx = createContext<ToastContextShape | null>(null);

type HoverMode = 'extend' | 'pause' | 'none';

interface ToastProviderProps { readonly children: React.ReactNode; readonly maxVisible?: number; readonly hoverMode?: HoverMode; readonly disableAutoDismissInTest?: boolean; }
export function ToastProvider({ children, maxVisible = 4, hoverMode = 'extend', disableAutoDismissInTest }: ToastProviderProps) {
  interface ActiveToast extends Toast { createdAt: number; total: number; remaining: number; paused: boolean; count: number; }
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const [queue, setQueue] = useState<ActiveToast[]>([]);
  const [exiting, setExiting] = useState<Record<string, boolean>>({});
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const MAX_VISIBLE = maxVisible;

  const removeNow = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
    setExiting(e => { const clone = { ...e }; delete clone[id]; return clone; });
  }, []);

  const beginExit = useCallback((id: string) => {
    setExiting(e => ({ ...e, [id]: true }));
    setTimeout(() => removeNow(id), 250);
  }, [removeNow]);

  const push = useCallback((message: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) => {
    setToasts(current => {
      const existingIndex = current.findIndex(t => t.message === message && t.type === (opts?.type || 'info'));
      if (existingIndex !== -1) {
        const clone = [...current];
        const existing = clone[existingIndex];
        const total = opts?.timeout ?? existing.total;
        clone[existingIndex] = { ...existing, createdAt: Date.now(), total, remaining: total, paused: false, count: existing.count + 1, action: opts?.action || existing.action };
        return clone;
      }
      const id = Math.random().toString(36).slice(2);
      const total = opts?.timeout ?? 4000;
      const active: ActiveToast = { id, message, type: opts?.type || 'info', timeout: total, action: opts?.action, createdAt: Date.now(), total, remaining: total, paused: false, count: 1 };
      if (current.length >= MAX_VISIBLE) {
        setQueue(q => [...q, active]);
        return current;
      }
      return [...current, active];
    });
  }, [MAX_VISIBLE]);

  // Promote queued toasts when space frees up
  useEffect(() => {
    if (toasts.length < MAX_VISIBLE && queue.length) {
      setToasts(t => {
        if (t.length >= MAX_VISIBLE) return t;
        const room = MAX_VISIBLE - t.length;
        const promote = queue.slice(0, room);
        setQueue(q => q.slice(room));
        return [...t, ...promote];
      });
    }
  }, [toasts.length, queue, MAX_VISIBLE]);

  // Interval ticker for remaining time & auto-exit (dynamic extension supported)
  // Interval ticker for remaining time (skipped entirely under test unless explicitly overridden)
  useEffect(() => {
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    if (isTest && disableAutoDismissInTest !== false) return; // skip in test by default
    const interval = setInterval(() => {
      setToasts(current => current.map(toast => {
        if (exiting[toast.id]) return toast;
        if (toast.paused) return toast;
        const elapsed = Date.now() - toast.createdAt;
        const remaining = Math.max(toast.total - elapsed, 0);
        if (remaining === 0) { beginExit(toast.id); return { ...toast, remaining: 0 }; }
        return { ...toast, remaining };
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [beginExit, exiting, disableAutoDismissInTest]);

  // Hover extend: +15% base (original) timeout per hover, capped at double original
  const extendToast = useCallback((id: string) => {
    setToasts(ts => ts.map(t => {
      if (t.id !== id) return t;
      const base = t.timeout || t.total;
      const added = Math.round(base * 0.15);
      const maxTotal = base * 2;
      if (t.total >= maxTotal) return t; // already at cap
      const elapsed = Date.now() - t.createdAt;
      const remaining = Math.max(t.total - elapsed, 0);
      const newTotal = Math.min(t.total + added, maxTotal);
      const growth = newTotal - t.total;
      const newRemaining = remaining + growth;
      const newCreatedAt = Date.now() - (newTotal - newRemaining);
      return { ...t, total: newTotal, createdAt: newCreatedAt };
    }));
  }, []);

  const pauseToast = useCallback((id: string) => {
    if (hoverMode !== 'pause') return;
    setToasts(ts => ts.map(t => {
      if (t.id !== id || t.paused) return t;
      const elapsed = Date.now() - t.createdAt;
      const remaining = Math.max(t.total - elapsed, 0);
      return { ...t, remaining, paused: true };
    }));
  }, [hoverMode]);

  const resumeToast = useCallback((id: string) => {
    if (hoverMode !== 'pause') return;
    setToasts(ts => ts.map(t => {
      if (t.id !== id || !t.paused) return t;
      const newCreatedAt = Date.now() - (t.total - t.remaining);
      return { ...t, createdAt: newCreatedAt, paused: false };
    }));
  }, [hoverMode]);

  const dismissAll = useCallback(() => {
    setExiting(toasts.reduce((acc, t) => ({ ...acc, [t.id]: true }), {}));
    setTimeout(() => setToasts([]), 260);
    setQueue([]);
  }, [toasts]);

  // Keyboard navigation for focus & deletion
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (!toasts.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIndex(i => (i == null ? 0 : Math.min(i + 1, toasts.length - 1))); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIndex(i => (i == null ? toasts.length - 1 : Math.max(i - 1, 0))); }
    else if (e.key === 'Home') { setFocusIndex(0); }
    else if (e.key === 'End') { setFocusIndex(toasts.length - 1); }
    else if (e.key === 'Delete') { if (focusIndex != null) beginExit(toasts[focusIndex].id); }
  }, [toasts, focusIndex, beginExit]);

  const ctxValue = useMemo(() => ({ push, dismissAll }), [push, dismissAll]);
  return (
    <ToastCtx.Provider value={ctxValue}>
      {children}
  <div aria-live="polite" aria-atomic="false" className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm outline-none" tabIndex={0} onKeyDown={handleKey} role="group" aria-label="Notifications">
        {toasts.map((t, idx) => {
          const isExiting = exiting[t.id];
          const delay = Math.min(idx * 60, 300);
          const percent = t.total ? (t.remaining / t.total) * 100 : 0;
          let variantClass = '';
          if (t.type === 'error') variantClass = 'toast-error';
          else if (t.type === 'success') variantClass = 'toast-success';
          return (
            <output
              key={t.id}
              onMouseEnter={() => { if (hoverMode === 'extend') extendToast(t.id); else if (hoverMode === 'pause') pauseToast(t.id); }}
              onMouseLeave={() => { if (hoverMode === 'pause') resumeToast(t.id); }}
              className={`group toast-base rounded-xl px-4 py-3 text-sm shadow-lg flex items-start gap-3 leading-snug will-change-transform relative overflow-hidden transition-all duration-200 ease-out ${variantClass} ${t.paused ? 'ring-1 ring-camo-light/60' : ''} ${focusIndex === idx ? 'outline outline-1 outline-brass' : ''} ${isExiting ? 'toast-fade-exit-active' : 'toast-fade-enter-active'}`}
              style={{ transitionDelay: isExiting ? '0ms' : `${delay}ms` }}
              tabIndex={focusIndex === idx ? 0 : -1}
              role="status"
            >
              <span className="flex-1">{t.message}{t.count > 1 && <sup className="ml-1 text-xs text-sky/70">×{t.count}</sup>}</span>
              {t.action && !isExiting && (
                <button
                  onClick={() => { t.action?.onClick(); beginExit(t.id); }}
                  className="text-xs px-2 py-1 rounded border border-camo-light hover:bg-camo-light/60 focus:outline-none focus:ring-1 focus:ring-camo-light"
                >
                  {t.action.label}
                </button>
              )}
              <button
                onClick={() => beginExit(t.id)}
                className="text-xs opacity-60 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-camo-light rounded"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
              {t.timeout && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 bottom-0 h-0.5 bg-brass/70 group-hover:bg-brass"
                  style={{
                    width: `${isExiting ? 0 : percent}%`,
                    transitionProperty: 'width',
                    transitionDuration: '120ms',
                    transitionTimingFunction: 'linear',
                    transitionDelay: '0ms'
                  }}
                />
              )}
            </output>
          );
        })}
        {(queue.length > 0) && (
          <div className="flex gap-2 pt-1 items-center">
            <button onClick={dismissAll} className="text-xs underline text-sky/80 hover:text-sky">Dismiss All</button>
            <span className="text-xs text-sky/60">Queued: {queue.length}</span>
          </div>
        )}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be within ToastProvider');
  return ctx;
}
