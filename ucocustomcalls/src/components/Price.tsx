import { formatUSD } from '@/lib/currency';

export function Price({ cents }: Readonly<{ cents: number }>) {
  return <>{formatUSD(cents)}</>;
}
