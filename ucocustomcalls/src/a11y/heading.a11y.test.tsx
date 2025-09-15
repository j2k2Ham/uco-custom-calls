import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/hooks/useCart';


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
