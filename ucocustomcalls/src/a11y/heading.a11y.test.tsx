// renderWithProviders supplies providers; no direct render import needed
import { axe } from '@/test/axe';
import { toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { renderWithProviders } from '@/test/providers';


expect.extend(toHaveNoViolations);

describe('Accessibility smoke tests', () => {
  it('hero + header + footer have no basic axe violations', async () => {
    const { container } = renderWithProviders(<><Header /><Hero /><Footer /></>);
    const results = await axe(container, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
