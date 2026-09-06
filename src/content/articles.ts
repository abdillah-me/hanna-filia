import type { Article } from './types.ts';

export const articles: Article[] = [
  {
    imageKey: 'article-1',
    category: { id: 'Belajar', en: 'Learning' },
    title: {
      id: 'Kenapa anak bisa lulus ujian tapi diam waktu diajak bicara',
      en: 'Why a child can pass the exam but freeze in conversation',
    },
    date: { id: 'Menunggu isi', en: 'Coming soon' },
  },
  {
    imageKey: 'article-2',
    category: { id: 'Persiapan tes', en: 'Test preparation' },
    title: {
      id: 'Dua bulan menuju TOEFL: yang perlu dan tidak perlu dilatih',
      en: 'Two months to TOEFL: what to drill and what to skip',
    },
    date: { id: 'Menunggu isi', en: 'Coming soon' },
  },
  {
    imageKey: 'article-3',
    category: { id: 'Studi luar negeri', en: 'Studying abroad' },
    title: {
      id: 'Berkas kuliah ke Malaysia, urutan yang bikin tidak bolak-balik',
      en: 'Malaysian university paperwork, in the order that saves you a second trip',
    },
    date: { id: 'Menunggu isi', en: 'Coming soon' },
  },
];
