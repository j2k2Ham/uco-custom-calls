import { render, screen } from '@testing-library/react';
import ProductPage, { generateMetadata } from './[slug]/page';
import { PRODUCTS } from '@/lib/products';

describe('Product detail page', () => {
  const sample = PRODUCTS[0];

  it('renders product title and price', async () => {
    const ui = await ProductPage({ params: { slug: sample.slug } });
    render(ui);
    expect(screen.getByRole('heading', { name: sample.title })).toBeInTheDocument();
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it('provides JSON-LD scripts', async () => {
    const ui = await ProductPage({ params: { slug: sample.slug } });
    render(ui);
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2); // product + breadcrumb
    const productScript = Array.from(scripts).find(s => s.textContent && s.textContent.includes('"@type":"Product"'));
    expect(productScript).toBeTruthy();
    const text = productScript?.textContent || '';
    expect(text).toContain('"brand"');
    expect(text).toContain('"seller"');
    // Extended SEO fields
    expect(text).toMatch(/"mpn"/);
    // Review array presence (if any sample product has reviews)
    if (sample.reviews && sample.reviews.length) {
      expect(text).toMatch(/"review"/);
      expect(text).toMatch(/"ratingValue"/);
    }
  });

  it('generates metadata', async () => {
    const meta = await generateMetadata({ params: { slug: sample.slug } });
    expect(meta.title).toContain(sample.title);
  });
});
