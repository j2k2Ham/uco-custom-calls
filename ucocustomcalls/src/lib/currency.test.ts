import { formatUSD, sumCents } from './currency';

describe('currency utilities', () => {
  describe('sumCents', () => {
    it('sums empty array to 0', () => {
      expect(sumCents([])).toBe(0);
    });
    it('sums positive values', () => {
      expect(sumCents([100, 250, 650])).toBe(1000);
    });
    it('handles negative adjustments', () => {
      expect(sumCents([1000, -200, 50])).toBe(850);
    });
  });

  describe('formatUSD', () => {
    it('formats whole dollar amounts', () => {
      expect(formatUSD(12300)).toBe('$123.00');
    });
    it('formats cents correctly', () => {
      expect(formatUSD(12345)).toBe('$123.45');
    });
    it('formats zero', () => {
      expect(formatUSD(0)).toBe('$0.00');
    });
  });
});
