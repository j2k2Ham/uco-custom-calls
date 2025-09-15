import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { vi } from 'vitest';
import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/hooks/useCart';

// Mock next/link to avoid async prefetch side-effects causing act() warnings
interface MockLinkProps {
  href: string | { pathname?: string };
  children: React.ReactNode;
  [key: string]: unknown;
}

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: MockLinkProps) => (
    <a href={typeof href === 'string' ? href : href?.pathname || '#'} {...rest}>
      {children}
    </a>
  ),
}));

expect.extend(toHaveNoViolations);

describe('Accessibility smoke tests', () => {
  it('hero + header + footer have no basic axe violations', async () => {
    const { container } = render(
      <CartProvider>
        <Header />
        <Hero />
        <Footer />
      </CartProvider>
    );
    const results = await axe(container, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
