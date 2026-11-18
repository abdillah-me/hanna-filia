import { test } from 'node:test';
import assert from 'node:assert/strict';
import { organizationJsonLd, pageMetadata, jsonLdHtml } from '../src/lib/seo.ts';
import { site } from '../src/content/site.ts';

test('organization JSON-LD derives phone, postcode and hours from site.ts', () => {
  const org = organizationJsonLd('id');
  assert.match(org.telephone, /^\+62\d{8,12}$/);
  assert.match(org.address.postalCode ?? '', /^\d{5}$/);
  // Every non-closed row of site.hours must parse; a silent miss would drop
  // opening hours from Google without failing anything else.
  const open = site.hours.filter((h) => /\d/.test(h.open.en)).length;
  assert.equal(org.openingHoursSpecification.length, open);
  assert.deepEqual(org.openingHoursSpecification[0].opens, '09:00');
});

test('page metadata carries canonical, every locale, x-default and its own Open Graph', () => {
  const m = pageMetadata('en', '/programs/kids', 'T', 'D');
  assert.equal(m.alternates?.canonical, '/en/programs/kids');
  assert.deepEqual(m.alternates?.languages, {
    id: '/id/programs/kids', en: '/en/programs/kids', 'x-default': '/id/programs/kids',
  });
  assert.equal(m.openGraph?.title, 'T');
  assert.equal(m.openGraph?.url, '/en/programs/kids');
});

test('JSON-LD output cannot close its script tag', () => {
  assert.ok(!jsonLdHtml({ a: '</script>' }).__html.includes('<'));
});
