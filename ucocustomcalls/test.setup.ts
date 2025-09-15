import { vi } from 'vitest';
import React from 'react';

// Central next/link mock to prevent act() warnings from prefetch logic in tests
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string | { pathname?: string }; children: React.ReactNode; [k: string]: unknown }) =>
    React.createElement(
      'a',
      { href: typeof href === 'string' ? href : href?.pathname || '#', ...rest },
      children
    ),
}));
