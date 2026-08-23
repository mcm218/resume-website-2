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
  address: { '@type': 'PostalAddress'; addressLocality: string; addressRegion?: string };
};

/** The name-and-title line shared by Open Graph and the social image's alt text. */
export function socialTitle(contact: Contact): string {
  return `${contact.name} - ${contact.title}`;
}

/**
 * schema.org wants the city in `addressLocality` and the state beside it in
 * `addressRegion`; the resume stores them as one "Charlotte, NC" line.
 */
function postalAddress(location: string): PersonJsonLd['address'] {
  const [locality, region] = location.split(',').map((part) => part.trim());
  return region
    ? { '@type': 'PostalAddress', addressLocality: locality, addressRegion: region }
    : { '@type': 'PostalAddress', addressLocality: locality };
}

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
    address: postalAddress(contact.location),
  };
}
