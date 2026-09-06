import type { FaqItem } from './types.ts';

export const faq: FaqItem[] = [
  {
    q: { id: 'Apakah bisa coba kelas dulu sebelum daftar?', en: 'Can I try a class before enrolling?' },
    a: {
      id: 'Bisa. Satu sesi percobaan gratis, tanpa kewajiban lanjut. Hubungi kami untuk jadwalnya.',
      en: 'Yes. One free trial session, with no obligation to continue. Contact us to arrange a time.',
    },
  },
  {
    q: { id: 'Bagaimana cara tahu level saya?', en: 'How do I find out my level?' },
    a: {
      id: 'Kami adakan tes penempatan gratis sekitar 30 menit sebelum pendaftaran.',
      en: 'We run a free placement test of about 30 minutes before you enrol.',
    },
  },
  {
    q: { id: 'Berapa jumlah siswa per kelas?', en: 'How many students are in a class?' },
    a: { id: 'Maksimal 8 orang.', en: 'Eight at most.' },
  },
  {
    q: { id: 'Apakah ada kelas privat?', en: 'Do you offer private classes?' },
    a: {
      id: 'Ada, untuk semua program. Biaya dan jadwal disesuaikan.',
      en: 'Yes, for every programme. Fees and scheduling are arranged individually.',
    },
  },
  {
    q: { id: 'Apakah ada kelas online?', en: 'Do you offer online classes?' },
    a: {
      id: 'Ada untuk Conversation, TOEFL/IELTS, dan Business English. Kelas Kids hanya tatap muka.',
      en: 'Yes for Conversation, TOEFL/IELTS, and Business English. Kids classes are in person only.',
    },
  },
  {
    q: { id: 'Bisa bayar per bulan?', en: 'Can I pay monthly?' },
    a: {
      id: 'Bisa untuk program bulanan. Program TOEFL/IELTS dibayar per paket, boleh dua kali cicil.',
      en: 'Yes for the monthly programmes. TOEFL/IELTS is charged per package and can be split into two payments.',
    },
  },
  {
    q: { id: 'Apakah dapat sertifikat?', en: 'Do I get a certificate?' },
    a: { id: 'Ya, di akhir setiap level.', en: 'Yes, at the end of every level.' },
  },
];
