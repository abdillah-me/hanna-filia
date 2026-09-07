import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { programs } from '../src/content/programs.ts';
import { teachers } from '../src/content/teachers.ts';
import { faq } from '../src/content/faq.ts';
import { hfosServices, hfosCountries, hfosSteps } from '../src/content/hfos.ts';
import { galleryItems, galleryCategories, activities } from '../src/content/gallery.ts';
import { articles } from '../src/content/articles.ts';
import { about, crossProgramBenefits } from '../src/content/about.ts';
import { testimonials, hfosTestimonial } from '../src/content/testimonials.ts';
import { site, stats } from '../src/content/site.ts';
import { images } from '../src/content/images.ts';

/** Walks any value and yields every object that looks like a Localized. */
function* localizedValues(node: unknown, path: string): Generator<[string, Record<string, unknown>]> {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const [i, item] of node.entries()) yield* localizedValues(item, `${path}[${i}]`);
    return;
  }
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 2 && keys.includes('id') && keys.includes('en')) {
    yield [path, obj];
    return;
  }
  for (const [k, v] of Object.entries(obj)) yield* localizedValues(v, `${path}.${k}`);
}

const CONTENT: Record<string, unknown> = {
  programs, teachers, faq, hfosServices, hfosCountries, hfosSteps,
  galleryItems, galleryCategories, activities, articles, about,
  crossProgramBenefits, testimonials, hfosTestimonial, site, stats, images,
};

test('every Localized value has non-empty id and en', () => {
  let checked = 0;
  for (const [name, root] of Object.entries(CONTENT)) {
    for (const [path, value] of localizedValues(root, name)) {
      checked++;
      for (const locale of ['id', 'en'] as const) {
        const s = value[locale];
        assert.equal(typeof s, 'string', `${path}.${locale} is not a string`);
        assert.ok((s as string).trim().length > 0, `${path}.${locale} is empty`);
      }
    }
  }
  assert.ok(checked > 100, `only ${checked} localized values found — content is missing`);
});

// Recurses into arrays by index, same as the empty-string walker below, so a
// future array of strings in the messages JSON is compared element-by-element
// rather than as one opaque leaf.
function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`));
  }
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>)
    .flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

test('id.json and en.json have identical key sets', () => {
  const url = (f: string) => new URL(`../messages/${f}`, import.meta.url);
  const idKeys = keyPaths(JSON.parse(readFileSync(url('id.json'), 'utf8'))).sort();
  const enKeys = keyPaths(JSON.parse(readFileSync(url('en.json'), 'utf8'))).sort();

  const missingInEn = idKeys.filter((k) => !enKeys.includes(k));
  const missingInId = enKeys.filter((k) => !idKeys.includes(k));

  assert.deepEqual(missingInEn, [], `keys present in id.json but missing from en.json`);
  assert.deepEqual(missingInId, [], `keys present in en.json but missing from id.json`);
});

test('no translation string is empty', () => {
  for (const file of ['id.json', 'en.json']) {
    const json = readFileSync(new URL(`../messages/${file}`, import.meta.url), 'utf8');
    const walk = (node: unknown, path: string): void => {
      if (typeof node === 'string') {
        assert.ok(node.trim().length > 0, `${file}:${path} is empty`);
        return;
      }
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
      }
    };
    walk(JSON.parse(json), file);
  }
});

test('programs have unique slugs and sequential levels', () => {
  assert.equal(programs.length, 5);
  assert.equal(new Set(programs.map((p) => p.slug)).size, 5);
  assert.deepEqual(programs.map((p) => p.n), [1, 2, 3, 4, 5]);
});

test('gallery categories cover every gallery item', () => {
  const declared = new Set(galleryCategories.map((c) => c.key));
  for (const item of galleryItems) {
    assert.ok(declared.has(item.category), `gallery category "${item.category}" is not in galleryCategories`);
  }
});

test('WhatsApp number is stored in E.164 form without punctuation', () => {
  assert.match(site.whatsappE164, /^62\d{9,13}$/);
});

test('every imageKey referenced by content exists in the manifest', () => {
  const keys = new Set(Object.keys(images));
  const referenced = [
    ...programs.map((p) => p.imageKey),
    ...teachers.map((x) => x.imageKey),
    ...galleryItems.map((g) => g.imageKey),
    ...articles.map((a) => a.imageKey),
    'building-front',
    'hfos-hero',
  ];
  for (const key of referenced) {
    assert.ok(keys.has(key), `imageKey "${key}" is referenced but missing from images.ts`);
  }
});

test('every non-teacher image has a src and a ratio', () => {
  for (const [key, entry] of Object.entries(images)) {
    assert.match(entry.ratio, /^\d+\/\d+$/, `${key} has an invalid ratio "${entry.ratio}"`);
    if (!key.startsWith('teacher-')) {
      assert.ok(entry.src.length > 0, `${key} has no src`);
    }
  }
});
