import type { Metadata } from 'next';
import Image from 'next/image';
import { aboutPageJsonLD, breadcrumbJsonLD } from '@/lib/structuredData';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about UCO Custom Calls – our history, craftsmanship, and passion for waterfowl hunting.'
};

const content = `We are UCO—Unami Creek Outfitters. UCO Custom Calls began in a small workshop in southeastern Pennsylvania, near Unami Creek, back in 2016. Since then, we’ve been making custom duck and goose calls, as well as paracord lanyards for waterfowl hunting.

Our goal is to provide the highest quality calls and lanyards—built to last and withstand any conditions you may face in the field. Whether cold or warm, wet or dry, our calls consistently produce realistic sounds, and our lanyards keep your calls safe and secure.

Our team has always had a strong passion for the outdoors, and more specifically, waterfowl hunting. We take great pride in our craftsmanship and are committed to offering you the very best hunting products. Modestly priced, our calls and lanyards are the best choice for hunters who demand quality.

We are confident you’ll be pleased with every product you purchase. At UCO, our standard is quality over quantity. We look forward to hearing from you!`;

const IMAGES = [
  { src: '/images/goose.jpg', alt: 'Canada goose in field' },
  { src: '/images/woodie.jpg', alt: 'Wood duck on water' },
  { src: '/images/wc.jpg', alt: 'Waterfowl call setup' }
];

export default function AboutPage() {
  const jsonLd = aboutPageJsonLD({
    name: 'About UCO Custom Calls',
    description: content,
    imageUrls: IMAGES.map(i => i.src)
  });
  const breadcrumbs = breadcrumbJsonLD([
    { name: 'Home', url: 'https://ucocustomcalls.com/' },
    { name: 'About', url: 'https://ucocustomcalls.com/about' }
  ]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Crafted for the Hunt</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">Precision duck & goose calls and paracord lanyards built in Pennsylvania—engineered to perform in any condition.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/products" className="px-5 py-2 rounded-md bg-brass text-black font-medium hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70">Browse Calls</Link>
          <Link href="/custom" className="px-5 py-2 rounded-md border border-camo-light hover:bg-camo-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/70">Custom Orders</Link>
        </div>
      </section>
      <div className="mx-auto max-w-5xl">
        <p className="leading-relaxed text-lg whitespace-pre-line">{content}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {IMAGES.map(img => (
            <div key={img.src} className="relative aspect-[4/3] rounded overflow-hidden border border-camo-light bg-camo/40">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </main>
  );
}
