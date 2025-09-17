import { CustomInquiryForm } from '@/components/CustomInquiryForm';
import { contactPageJsonLD } from '@/lib/structuredData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Calls & Lanyards Inquiry | UCO Custom Calls',
  description: 'Request custom acrylic duck & goose calls or paracord lanyards. Colorways, engravings, reeds & more.'
};

export default function CustomPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLD({
          name: 'Custom Calls & Lanyards Inquiry',
          description: 'Custom acrylic duck and goose calls and paracord lanyards – request engraving, colorways, reed setup, and lanyard options.',
          email: 'and360900@gmail.com'
        })) }}
      />
      <h1 className="text-3xl font-semibold">Custom Calls</h1>
      <p className="mt-3 text-sky">
        Want a specific acrylic colorway or engraving? Tell us what you’re after.
      </p>
      <div className="mt-6 space-y-4 text-sky leading-relaxed">
        <p>
          We offer a wide variety of different options for custom calls and paracord lanyards for waterfowl hunting.
        </p>
        <p>
          Below, please describe what style, color and any additional details you&apos;re looking to have on your call or lanyard. Such as engravings for your band, single or double reed insert and what color insert you&apos;d like.
        </p>
        <p>
          For lanyards &mdash; please include how many drops you&apos;d like it to have, what color(s) of paracord you want it made from and whether you&apos;d like a finisher added.
        </p>
        <p>
          Please allow up to 24 hours for us to respond to your email. Thank you and we look forward to hearing from you.
        </p>
      </div>
      <CustomInquiryForm />
    </section>
  );
}
