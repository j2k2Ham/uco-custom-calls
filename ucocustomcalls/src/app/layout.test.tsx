import { render } from '@testing-library/react';
import React from 'react';
import RootLayout from './layout';

describe('Root layout JSON-LD', () => {
  it('renders Organization, SiteNavigationElement, WebSite, and Logo ImageObject schemas', () => {
    // Invoke the layout directly as a function (App Router pattern) and render its return value.
    const tree = RootLayout({ children: <div /> });
    render(<>{tree}</>);
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const jsons = scripts.map(s => {
      try { return JSON.parse(s.textContent || '{}'); } catch { return {}; }
    });
    const types = jsons.map(j => j['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('SiteNavigationElement');
    expect(types).toContain('WebSite');
    const hasLogo = jsons.some(j => j['@type'] === 'ImageObject' && /company-logo/.test(j.url || ''));
    expect(hasLogo).toBe(true);
    const website = jsons.find(j => j['@type'] === 'WebSite');
    expect(website?.potentialAction?.['@type']).toBe('SearchAction');
    expect(website?.potentialAction?.target).toContain('/search?q=');
  });
});
