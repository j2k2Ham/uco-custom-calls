const USD_FORMATTER = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatUSD(cents: number): string {
  return USD_FORMATTER.format(cents / 100);
}

export function sumCents(values: number[]): number {
  return values.reduce((n, v) => n + v, 0);
}