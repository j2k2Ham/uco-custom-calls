import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders provided label', () => {
    render(<Badge label="Limited" />);
    expect(screen.getByText('Limited')).toBeInTheDocument();
  });
});
