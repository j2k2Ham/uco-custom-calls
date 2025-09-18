import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { productUrl, categoryUrl, productsListingUrl } from '@/lib/urls';
import { productJsonLD, breadcrumbJsonLD } from '@/lib/structuredData';
import { AddToCartButton } from "@/components/AddToCartButton";
import { AudioPlayer } from "@/components/AudioPlayer";
import { formatPriceFromCents, getPriceCents } from "@/types/product";
import { ProductGallery } from "@/components/ProductGallery";

interface ProductPageParams { readonly slug: string }
interface ProductPageProps { readonly params: ProductPageParams | Promise<ProductPageParams> }

export const dynamicParams = true;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolved = await params;
  const product = PRODUCTS.find(p => p.slug === resolved.slug);
  if (!product) return { title: 'Product Not Found' };
  const title = product.seo?.metaTitle || product.title;
  const description = product.seo?.metaDescription || product.description.slice(0, 160);
  const images = product.images?.[0] ? [{ url: product.images[0].src, alt: product.images[0].alt }] : undefined;
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images,
      url: productUrl(product.slug)
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: { canonical: `/products/${product.slug}` }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolved = await params;
  const product = PRODUCTS.find(p => p.slug === resolved.slug);
  if (!product) return notFound();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-2 lg:gap-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLD({
            name: product.title,
            description: product.description,
            sku: product.id,
            image: product.images[0]?.src || '',
            priceCents: getPriceCents(product),
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: productUrl(product.slug),
            ratingValue: product.ratingValue,
            ratingCount: product.ratingCount,
            ratingBest: product.ratingBest
          }))
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLD([
            { name: 'Products', url: productsListingUrl() },
            { name: product.category, url: categoryUrl(product.category) },
            { name: product.title, url: productUrl(product.slug) }
          ]))
        }}
      />
      <div><ProductGallery product={product} /></div>

      <div className="mt-8 lg:mt-0">
        <h1 className="text-3xl font-semibold">{product.title}</h1>
  <p className="mt-1 text-brass text-xl">{formatPriceFromCents(getPriceCents(product))}</p>
        <p className="mt-4 text-sky">{product.description}</p>

        {product.audio && product.audio.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Sound Files</h2>
            <ul className="space-y-3">
              {product.audio.map(a => (
                <li key={a.src}><AudioPlayer src={a.src} label={a.label} /></li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>

        <div className="mt-8 text-sm text-sky/80">
          <p>Free returns within 30 days. Built to perform wet or dry, cold or warm.</p>
        </div>
      </div>
    </section>
  );
}
