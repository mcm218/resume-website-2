import { describe, expect, it } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';
import { SITE_URL, personJsonLd } from './seo';
import { resume } from '@/data/resume';

describe('personJsonLd', () => {
  const person = personJsonLd(resume.contact);

  it('describes the resume owner as a schema.org Person', () => {
    expect(person['@context']).toBe('https://schema.org');
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe(resume.contact.name);
    expect(person.jobTitle).toBe(resume.contact.title);
    expect(person.email).toBe(`mailto:${resume.contact.email}`);
  });

  it('links the profiles the resume lists', () => {
    expect(person.sameAs).toEqual([resume.contact.linkedin, resume.contact.github]);
  });

  it('carries the locality rather than a free-text address', () => {
    expect(person.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: resume.contact.location,
    });
  });
});

describe('sitemap', () => {
  it('lists the single page, absolute', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe(`${SITE_URL}/`);
  });
});

describe('robots', () => {
  it('allows every crawler and points at the sitemap', () => {
    const rules = robots();
    expect(rules.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(rules.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
