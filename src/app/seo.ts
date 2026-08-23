import type { Contact } from '@/data/schema';

export const SITE_URL = 'https://michaelcmuniz.com';

type PersonJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  email: string;
  url: string;
  sameAs: string[];
  address: { '@type': 'PostalAddress'; addressLocality: string };
};

/** The resume owner as schema.org `Person`, straight from the resume's contact. */
export function personJsonLd(contact: Contact): PersonJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: contact.name,
    jobTitle: contact.title,
    email: `mailto:${contact.email}`,
    url: SITE_URL,
    sameAs: [contact.linkedin, contact.github],
    address: { '@type': 'PostalAddress', addressLocality: contact.location },
  };
}
