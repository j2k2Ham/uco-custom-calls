import { render, screen } from '@testing-library/react';
import { Price } from './Price';

describe('Price', () => {
  it('renders formatted USD value', () => {
    render(<Price cents={12345} />);
    expect(screen.getByText('$123.45')).toBeInTheDocument();
  });
});
