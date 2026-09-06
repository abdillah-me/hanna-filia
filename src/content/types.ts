export type Locale = 'id' | 'en';

export const LOCALES: readonly Locale[] = ['id', 'en'] as const;

/** A string that exists in both languages. Both fields are required, so a
 *  forgotten translation is a compile error rather than a blank on the page. */
export type Localized = { id: string; en: string };

export function t(value: Localized, locale: Locale): string {
  return value[locale];
}

export type ProgramSlug = 'kids' | 'teens' | 'conversation' | 'toefl-ielts' | 'business';

export type Program = {
  slug: ProgramSlug;
  n: 1 | 2 | 3 | 4 | 5;
  name: Localized;
  shortName: Localized;
  audience: Localized;
  audienceShort: Localized;
  duration: Localized;
  schedule: Localized;
  minutes: Localized;
  summary: Localized;
  syllabus: Localized[];
  outcome: Localized;
  price: Localized;
  imageKey: string;
};

export type Teacher = {
  initials: string;
  name: string;
  role: Localized;
  credential: Localized;
  quote: Localized;
  imageKey: string;
};

export type FaqItem = { q: Localized; a: Localized };

export type HfosStep = { n: number; title: Localized; body: Localized };

export type GalleryCategory =
  | 'kids' | 'teens' | 'conversation' | 'toefl' | 'business' | 'events';

export type GalleryItem = {
  imageKey: string;
  category: GalleryCategory;
  label: Localized;
};

export type Article = {
  imageKey: string;
  category: Localized;
  title: Localized;
  date: Localized;
};

export type Value = { title: Localized; body: Localized };

export type Testimonial = { quote: Localized; name: string; role: Localized };

export type Hours = { day: Localized; open: Localized };
