const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ucocustomcalls.com';

export function contactPageJsonLD(opts: { name: string; description: string; email?: string }) {
  const email = opts.email || process.env.INQUIRY_DEST_EMAIL || 'support@ucocustomcalls.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: opts.name,
    description: opts.description,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email,
        contactType: 'customer support',
        availableLanguage: ['en']
      }
    ]
  };
}

interface OfferLD {
  '@type': 'Offer';
  priceCurrency: string;
  price: string;
  availability: string;
  url: string;
}

interface AggregateRatingLD {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
}

interface ProductLDBase {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string;
  offers: OfferLD;
  sku?: string;
  aggregateRating?: AggregateRatingLD;
}

export function productJsonLD(p: {
  name: string;
  description: string;
  sku?: string;
  image: string;
  priceCents: number;
  currency?: string;
  availability?: string;
  url: string;
  ratingValue?: number;
  ratingCount?: number;
  ratingBest?: number;
}) {
  const price = (p.priceCents / 100).toFixed(2);
  const currency = p.currency || 'USD';
  const offer: OfferLD = {
    '@type': 'Offer',
    priceCurrency: currency,
    price,
    availability: p.availability || 'https://schema.org/InStock',
    url: p.url
  };
  const data: ProductLDBase = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.image.startsWith('http') ? p.image : BASE_URL + p.image,
    offers: offer
  };
  if (p.sku) data.sku = p.sku;
  if (p.ratingValue && p.ratingCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.ratingValue,
      reviewCount: p.ratingCount,
      bestRating: p.ratingBest || 5
    };
  }
  return data;
}

export function breadcrumbJsonLD(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url
    }))
  };
}
