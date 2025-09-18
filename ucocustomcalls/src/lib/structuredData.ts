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
  mpn?: string;
  gtin13?: string;
  review?: ReviewLD[];
}

interface ReviewLD {
  '@type': 'Review';
  reviewBody?: string;
  datePublished?: string;
  author: { '@type': 'Person'; name: string };
  reviewRating: { '@type': 'Rating'; ratingValue: number; bestRating: number };
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
  mpn?: string;
  gtin13?: string;
  reviews?: { author: string; rating: number; body?: string; date?: string }[];
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
  let resolvedImage: string | string[];
  if (Array.isArray(p.image)) {
    resolvedImage = p.image.map(src => (src.startsWith('http') ? src : BASE_URL + src));
  } else {
    resolvedImage = p.image.startsWith('http') ? p.image : BASE_URL + p.image;
  }
  const data: ProductLDBase = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: resolvedImage,
    offers: offer
  };
  if (p.sku) data.sku = p.sku;
  if (p.mpn) data.mpn = p.mpn;
  if (p.gtin13) data.gtin13 = p.gtin13;
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
  if (p.reviews?.length) {
    data.review = p.reviews.map(r => ({
      '@type': 'Review',
      reviewBody: r.body,
      datePublished: r.date,
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 }
    }));
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
  let logo: string | undefined;
  if (opts.logo) {
    logo = opts.logo.startsWith('http') ? opts.logo : BASE_URL + opts.logo;
  }
  const sameAs = opts.sameAs?.length ? opts.sameAs : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: opts.url || BASE_URL + '/',
    logo,
    description: opts.description,
    sameAs
  };
}
