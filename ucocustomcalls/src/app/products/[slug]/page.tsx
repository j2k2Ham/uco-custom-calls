import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { AudioPlayer } from "@/components/AudioPlayer";
import { formatPriceFromCents, getPriceCents } from "@/types/product";
import { ProductGallery } from "@/components/ProductGallery";

interface ProductPageParams { slug: string }
interface ProductPageProps { params: ProductPageParams }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = PRODUCTS.find(p => p.slug === params.slug);
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
      url: `https://ucocustomcalls.com/products/${product.slug}`
    },
    alternates: { canonical: `/products/${product.slug}` }
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = PRODUCTS.find(p => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-2 lg:gap-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.images.map(i => i.src),
            sku: product.id,
            offers: {
              '@type': 'Offer',
              availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              priceCurrency: 'USD',
              price: (getPriceCents(product) / 100).toFixed(2),
              url: `https://ucocustomcalls.com/products/${product.slug}`
            }
          })
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
