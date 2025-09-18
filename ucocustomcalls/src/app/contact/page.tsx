import { CustomInquiryForm } from '@/components/CustomInquiryForm';
import { contactPageJsonLD } from '@/lib/structuredData';
import type { Metadata } from 'next';

const contactTitle = 'Contact Us | UCO Custom Calls';
const contactDescription = "How can we help you? We're here to help.";
export const metadata: Metadata = {
  title: contactTitle,
  description: contactDescription,
  openGraph: { type: 'website', title: contactTitle, description: contactDescription, url: 'https://ucocustomcalls.com/contact' },
  twitter: { card: 'summary', title: contactTitle, description: contactDescription }
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLD({
          name: 'Contact UCO Custom Calls',
          description: "How can we help you? We're here to help.",
          email: 'and360900@gmail.com'
        })) }}
      />
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <p className="mt-3 text-sky">How can we help you? We&apos;re here to help.</p>
      <div className="mt-6 space-y-4 text-sky leading-relaxed">
        <p>If you have a question about an order, a product, a custom call idea, or anything else—drop us a line.</p>
        <p>Fill out the form below and we typically respond within 24 hours.</p>
      </div>
      <CustomInquiryForm />
    </section>
  );
}
