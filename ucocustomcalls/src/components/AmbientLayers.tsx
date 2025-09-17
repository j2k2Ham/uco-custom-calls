"use client";
import React from 'react';

export function AmbientLayers({ delay = 400 }: { delay?: number }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const show = () => {
      if (!cancelled) setVisible(true);
    };
    // Prefer scheduling after main content painted
    if (typeof window !== 'undefined') {
      const w = window as typeof window & { requestIdleCallback?: (cb: () => void) => void };
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(() => setTimeout(show, delay));
      } else {
        setTimeout(show, delay + 120);
      }
    }
    return () => {
      cancelled = true;
    };
  }, [delay]);

  if (!visible) return null;
  return (
    <div className="fog-layer pointer-events-none" aria-hidden />
  );
}

export default AmbientLayers;
