import { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const items = PRODUCTS.map(p => ({ url: `https://www.ucocustomcalls.com/products/${p.slug}` }));
  const statics = ["/", "/about", "/contact", "/custom", "/sound-files", "/category/duck", "/category/goose", "/category/lanyards"]
    .map(url => ({ url: `https://www.ucocustomcalls.com${url}` }));
  return [...statics, ...items];
}
