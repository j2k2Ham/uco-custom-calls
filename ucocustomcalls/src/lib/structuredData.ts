export function contactPageJsonLD(opts: { name: string; description: string; email: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: opts.name,
    description: opts.description,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: opts.email,
        contactType: 'customer support',
        availableLanguage: ['en']
      }
    ]
  };
}
