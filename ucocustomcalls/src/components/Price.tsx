import { formatUSD } from '@/lib/currency';

export function Price({ cents }: { cents: number }) {
  return <>{formatUSD(cents)}</>;
}
