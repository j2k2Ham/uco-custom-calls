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
  priceValidUntil?: string;
  seller?: {
    '@type': 'Organization';
    name: string;
    url?: string;
  };
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
  image: string | string[];
  offers: OfferLD;
  sku?: string;
  brand?: { '@type': 'Brand'; name: string };
  aggregateRating?: AggregateRatingLD;
  category?: string;
}

export function productJsonLD(p: {
  name: string;
  description: string;
  sku?: string;
  image: string | string[];
  priceCents: number;
  currency?: string;
  availability?: string;
  url: string;
  ratingValue?: number;
  ratingCount?: number;
  ratingBest?: number;
  priceValidUntil?: string;
  brandName?: string;
  category?: string;
  sellerName?: string;
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
  if (p.priceValidUntil) offer.priceValidUntil = p.priceValidUntil;
  if (p.sellerName) offer.seller = { '@type': 'Organization', name: p.sellerName, url: BASE_URL + '/' };
  const data: ProductLDBase = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: Array.isArray(p.image)
      ? p.image.map(src => src.startsWith('http') ? src : BASE_URL + src)
      : (p.image.startsWith('http') ? p.image : BASE_URL + p.image),
    offers: offer
  };
  if (p.sku) data.sku = p.sku;
  if (p.brandName) data.brand = { '@type': 'Brand', name: p.brandName };
  if (p.category) data.category = p.category;
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

export function aboutPageJsonLD(opts: { name: string; description: string; url?: string; imageUrls?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: opts.name,
    description: opts.description,
    url: opts.url || BASE_URL + '/about',
    image: (opts.imageUrls || []).map(src => (src.startsWith('http') ? src : BASE_URL + src))
  };
}

export function organizationJsonLD(opts: { name: string; url?: string; logo?: string; sameAs?: string[]; description?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: opts.url || BASE_URL + '/',
    logo: opts.logo ? (opts.logo.startsWith('http') ? opts.logo : BASE_URL + opts.logo) : undefined,
    description: opts.description,
    sameAs: opts.sameAs && opts.sameAs.length ? opts.sameAs : undefined
  };
}
