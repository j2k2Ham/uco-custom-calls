import { bench, describe } from 'vitest';
import { formatUSD, sumCents } from '@/lib/currency';

const SAMPLE = Array.from({ length: 1000 }, (_, i) => (i + 1) * 17);

describe('currency utilities performance', () => {
  bench('formatUSD single value', () => {
    formatUSD(123456);
  });

  bench('formatUSD map batch', () => {
    SAMPLE.forEach(v => { formatUSD(v); });
  });

  bench('sumCents large array', () => {
    sumCents(SAMPLE);
  });
});
