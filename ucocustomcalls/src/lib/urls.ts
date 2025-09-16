const BASE = 'https://ucocustomcalls.com';

export function canonical(path: string): string {
  if (!path.startsWith('/')) return BASE + '/' + path;
  return BASE + path;
}

export function productUrl(slug: string) {
  return canonical(`/products/${slug}`);
}

export function categoryUrl(handle: string) {
  return canonical(`/category/${handle}`);
}

export function productsListingUrl() {
  return canonical('/products');
}
