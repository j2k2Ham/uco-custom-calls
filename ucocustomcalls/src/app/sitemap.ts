import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.ucocustomcalls.com';
  const now = new Date();
  const staticPaths = ['/', '/products', '/contact', '/custom'];
  const staticEntries = staticPaths.map(p => ({ url: base + p, lastModified: now }));
  const productEntries = PRODUCTS.map(p => ({ url: `${base}/products/${p.slug}`, lastModified: now }));
  const categoryEntries = CATEGORIES.map(c => ({ url: `${base}/category/${c.handle}`, lastModified: now }));
  return [...staticEntries, ...productEntries, ...categoryEntries];
}
