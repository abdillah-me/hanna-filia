import type { GalleryItem, Localized } from './types.ts';

export const galleryCategories: { key: 'all' | GalleryItem['category']; label: Localized }[] = [
  { key: 'all', label: { id: 'Semua', en: 'All' } },
  { key: 'kids', label: { id: 'Kids', en: 'Kids' } },
  { key: 'teens', label: { id: 'Teens', en: 'Teens' } },
  { key: 'conversation', label: { id: 'Conversation', en: 'Conversation' } },
  { key: 'toefl', label: { id: 'TOEFL & IELTS', en: 'TOEFL & IELTS' } },
  { key: 'business', label: { id: 'Business', en: 'Business' } },
  { key: 'events', label: { id: 'Kegiatan', en: 'Events' } },
];

export const galleryItems: GalleryItem[] = [
  { imageKey: 'gallery-kids-class', category: 'kids', label: { id: 'Suasana kelas Kids', en: 'Inside a Kids class' } },
  { imageKey: 'gallery-phonics', category: 'kids', label: { id: 'Kegiatan phonics', en: 'Phonics activity' } },
  { imageKey: 'gallery-teens-discussion', category: 'teens', label: { id: 'Diskusi kelas Teens', en: 'Teens class discussion' } },
  { imageKey: 'gallery-teens-presentation', category: 'teens', label: { id: 'Presentasi siswa Teens', en: 'Teens student presentation' } },
  { imageKey: 'gallery-conversation-roleplay', category: 'conversation', label: { id: 'Roleplay Conversation', en: 'Conversation roleplay' } },
  { imageKey: 'gallery-native-speaker', category: 'conversation', label: { id: 'Sesi native speaker', en: 'Native-speaker session' } },
  { imageKey: 'gallery-toefl-simulation', category: 'toefl', label: { id: 'Simulasi tes TOEFL', en: 'TOEFL mock test' } },
  { imageKey: 'gallery-business-inhouse', category: 'business', label: { id: 'Kelas in-house perusahaan', en: 'In-house corporate class' } },
  { imageKey: 'gallery-english-camp', category: 'events', label: { id: 'English Camp', en: 'English Camp' } },
  { imageKey: 'gallery-graduation', category: 'events', label: { id: 'Graduation', en: 'Graduation' } },
  { imageKey: 'gallery-speaking-day', category: 'events', label: { id: 'Speaking Day', en: 'Speaking Day' } },
  { imageKey: 'gallery-study-tour', category: 'events', label: { id: 'Study tour Singapura', en: 'Singapore study tour' } },
];

export const activities: { title: Localized; body: Localized }[] = [
  {
    title: { id: 'English Camp', en: 'English Camp' },
    body: { id: 'Dua hari setiap Juni, untuk siswa Kids dan Teens.', en: 'Two days every June, for Kids and Teens students.' },
  },
  {
    title: { id: 'Speaking Day', en: 'Speaking Day' },
    body: { id: 'Sabtu terakhir tiap bulan, terbuka untuk umum.', en: 'The last Saturday of every month, open to the public.' },
  },
  {
    title: { id: 'Graduation', en: 'Graduation' },
    body: { id: 'Akhir tiap level, penyerahan sertifikat.', en: 'At the end of every level, with certificates awarded.' },
  },
  {
    title: { id: 'Kunjungan kampus', en: 'Campus visits' },
    body: { id: 'Study tour ke Malaysia dan Singapura, setahun sekali.', en: 'An annual study tour to Malaysia and Singapore.' },
  },
];
