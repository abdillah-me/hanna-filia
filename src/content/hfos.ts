import type { HfosStep, Localized } from './types.ts';

export const hfosServices: Localized[] = [
  { id: 'Konsultasi pemilihan sekolah dan kampus', en: 'Choosing the right school or university' },
  { id: 'Jasa penerjemahan dokumen', en: 'Document translation' },
  { id: 'Pencarian tempat tinggal di negara tujuan', en: 'Finding accommodation in the destination country' },
  { id: 'Pengurusan visa dan student pass', en: 'Visa and student pass processing' },
  { id: 'Study tour ke kampus tujuan', en: 'Study tours to your target campus' },
];

export const hfosCountries: Localized[] = [
  { id: 'Malaysia', en: 'Malaysia' },
  { id: 'Singapura', en: 'Singapore' },
  { id: 'Australia', en: 'Australia' },
  { id: 'Kanada', en: 'Canada' },
  { id: 'Cina', en: 'China' },
  { id: 'Amerika Serikat', en: 'United States' },
  { id: 'Selandia Baru', en: 'New Zealand' },
];

export const hfosSteps: HfosStep[] = [
  {
    n: 1,
    title: { id: 'Konsultasi awal', en: 'First consultation' },
    body: {
      id: 'Kami petakan minat, nilai, dan anggaran keluarga.',
      en: 'We map out interests, grades, and the family budget.',
    },
  },
  {
    n: 2,
    title: { id: 'Pemilihan kampus', en: 'Choosing a university' },
    body: {
      id: 'Kami susun 3–5 pilihan realistis beserta perkiraan biaya.',
      en: 'We put together three to five realistic options with cost estimates.',
    },
  },
  {
    n: 3,
    title: { id: 'Persiapan bahasa', en: 'Language preparation' },
    body: {
      id: 'Kalau skor belum cukup, masuk kelas TOEFL/IELTS dulu.',
      en: 'If the score is not there yet, TOEFL/IELTS classes come first.',
    },
  },
  {
    n: 4,
    title: { id: 'Berkas & aplikasi', en: 'Documents & application' },
    body: {
      id: 'Terjemahan dokumen, pengisian formulir, pengiriman.',
      en: 'Document translation, filling in the forms, submission.',
    },
  },
  {
    n: 5,
    title: { id: 'Visa & student pass', en: 'Visa & student pass' },
    body: { id: 'Pendampingan sampai wawancara.', en: 'Support all the way through the interview.' },
  },
  {
    n: 6,
    title: { id: 'Keberangkatan', en: 'Departure' },
    body: {
      id: 'Akomodasi, orientasi, kontak darurat di negara tujuan.',
      en: 'Accommodation, orientation, and emergency contacts in the destination country.',
    },
  },
];
