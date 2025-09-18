import { render, screen } from '@testing-library/react';
import CategoryPage, { generateMetadata } from './[handle]/page';

describe('Gear category page', () => {
  it('includes the Camo UCO Hat product card', async () => {
    // Render the dynamic category page component with params
    // Since the component expects an async function, call default export with params
    const ui = await CategoryPage({ params: { handle: 'gear' } });
    render(ui);
    expect(screen.getByText(/Camo UCO Hat/i)).toBeInTheDocument();
  });

  it('metadata uses Gear title and keywords', async () => {
    const meta = await generateMetadata({ params: { handle: 'gear' } });
    expect(meta.title).toMatch(/Gear \| UCO Custom Calls/);
    expect(meta.keywords).toContain('camo hat');
  });
});
