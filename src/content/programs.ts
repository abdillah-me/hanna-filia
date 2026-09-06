import type { Program } from './types.ts';

export const programs: Program[] = [
  {
    slug: 'kids',
    n: 1,
    imageKey: 'class-kids',
    name: { id: 'English for Kids', en: 'English for Kids' },
    shortName: { id: 'English for Kids', en: 'English for Kids' },
    audience: { id: 'Usia 6–12 tahun', en: 'Ages 6–12' },
    audienceShort: { id: '6–12 th', en: 'Ages 6–12' },
    duration: { id: '3 bulan', en: '3 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '60 menit', en: '60 minutes' },
    summary: {
      id: 'Kosakata sehari-hari, phonics, dan percakapan dasar lewat lagu, permainan, dan cerita pendek.',
      en: 'Everyday vocabulary, phonics, and simple conversation through songs, games, and short stories.',
    },
    syllabus: [
      { id: 'Kosakata sehari-hari', en: 'Everyday vocabulary' },
      { id: 'Phonics', en: 'Phonics' },
      { id: 'Lagu dan permainan', en: 'Songs and games' },
      { id: 'Membaca cerita pendek', en: 'Reading short stories' },
      { id: 'Percakapan dasar', en: 'Basic conversation' },
    ],
    outcome: {
      id: 'Anak bisa memperkenalkan diri, bercerita tentang keseharian, dan membaca teks pendek.',
      en: 'Your child can introduce themselves, talk about their day, and read short texts.',
    },
    price: { id: 'Rp 650.000 / bulan', en: 'Rp 650,000 / month' },
  },
  {
    slug: 'teens',
    n: 2,
    imageKey: 'class-teens',
    name: { id: 'English for Teens', en: 'English for Teens' },
    shortName: { id: 'English for Teens', en: 'English for Teens' },
    audience: { id: 'Siswa SMP & SMA', en: 'Junior and senior high school students' },
    audienceShort: { id: 'SMP–SMA', en: 'Ages 13–18' },
    duration: { id: '3 bulan', en: '3 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Grammar terstruktur, writing, dan presentasi, dengan latihan soal sekolah dan diskusi topik remaja.',
      en: 'Structured grammar, writing, and presentation skills, with school exam practice and discussion of topics teenagers actually care about.',
    },
    syllabus: [
      { id: 'Grammar terstruktur', en: 'Structured grammar' },
      { id: 'Writing', en: 'Writing' },
      { id: 'Presentasi', en: 'Presentation skills' },
      { id: 'Latihan soal sekolah', en: 'School exam practice' },
      { id: 'Diskusi topik remaja', en: 'Discussion of teen topics' },
    ],
    outcome: {
      id: 'Nilai sekolah naik dan siap ikut tes bahasa tingkat dasar.',
      en: 'Better school marks and readiness for entry-level English tests.',
    },
    price: { id: 'Rp 750.000 / bulan', en: 'Rp 750,000 / month' },
  },
  {
    slug: 'conversation',
    n: 3,
    imageKey: 'class-conversation',
    name: { id: 'Conversation Class', en: 'Conversation Class' },
    shortName: { id: 'Conversation', en: 'Conversation' },
    audience: { id: 'Umum, 15 tahun ke atas', en: 'Open to anyone aged 15 and over' },
    audienceShort: { id: '15 th +', en: '15+' },
    duration: { id: '3 bulan', en: '3 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Percakapan tematik dan roleplay situasi nyata, dengan sesi bulanan bersama pengajar native speaker.',
      en: 'Themed conversation and real-situation roleplay, with a monthly session led by a native-speaker teacher.',
    },
    syllabus: [
      { id: 'Percakapan tematik', en: 'Themed conversation' },
      { id: 'Roleplay situasi nyata', en: 'Real-situation roleplay' },
      { id: 'Pelafalan', en: 'Pronunciation' },
      { id: 'Sesi bulanan dengan pengajar native speaker', en: 'Monthly session with a native-speaker teacher' },
    ],
    outcome: {
      id: 'Berani bicara spontan dalam situasi kerja dan sehari-hari.',
      en: 'The confidence to speak off the cuff, at work and in daily life.',
    },
    price: { id: 'Rp 850.000 / bulan', en: 'Rp 850,000 / month' },
  },
  {
    slug: 'toefl-ielts',
    n: 4,
    imageKey: 'class-toefl',
    name: { id: 'TOEFL & IELTS Preparation', en: 'TOEFL & IELTS Preparation' },
    shortName: { id: 'TOEFL & IELTS', en: 'TOEFL & IELTS' },
    audience: {
      id: 'Pelajar, mahasiswa, dan pekerja yang butuh skor resmi',
      en: 'Students and professionals who need an official score',
    },
    audienceShort: { id: 'Intensif', en: 'Intensive' },
    duration: { id: '2 bulan intensif', en: '2 intensive months' },
    schedule: { id: '3× seminggu', en: 'Three times a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Strategi per section, bank soal, dan dua kali simulasi tes lengkap dengan konsultasi target skor.',
      en: 'Section-by-section strategy, a question bank, and two full mock tests with a target-score consultation.',
    },
    syllabus: [
      { id: 'Strategi per section', en: 'Section-by-section strategy' },
      { id: 'Bank soal', en: 'Question bank' },
      { id: 'Dua kali simulasi tes lengkap', en: 'Two full mock tests' },
      { id: 'Konsultasi target skor', en: 'Target-score consultation' },
    ],
    outcome: {
      id: 'Peningkatan skor rata-rata 60 poin TOEFL ITP.',
      en: 'An average gain of 60 points on the TOEFL ITP.',
    },
    price: { id: 'Rp 2.400.000 / paket', en: 'Rp 2,400,000 / package' },
  },
  {
    slug: 'business',
    n: 5,
    imageKey: 'class-business',
    name: { id: 'Business English', en: 'Business English' },
    shortName: { id: 'Business English', en: 'Business English' },
    audience: { id: 'Karyawan dan profesional', en: 'Employees and professionals' },
    audienceShort: { id: 'Profesional', en: 'Professionals' },
    duration: { id: '2 bulan', en: '2 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Email, meeting, presentasi, dan negosiasi. Tersedia kelas malam dan in-house di perusahaan.',
      en: 'Email, meetings, presentations, and negotiation. Evening classes and in-house corporate training available.',
    },
    syllabus: [
      { id: 'Email dan korespondensi', en: 'Email and correspondence' },
      { id: 'Meeting', en: 'Meetings' },
      { id: 'Presentasi', en: 'Presentations' },
      { id: 'Negosiasi', en: 'Negotiation' },
      { id: 'Istilah industri', en: 'Industry terminology' },
    ],
    outcome: {
      id: 'Mampu memimpin rapat dan menulis korespondensi kerja dalam bahasa Inggris.',
      en: 'Able to chair a meeting and handle work correspondence in English.',
    },
    price: {
      id: 'Rp 1.100.000 / bulan · in-house dihitung per perusahaan',
      en: 'Rp 1,100,000 / month · in-house quoted per company',
    },
  },
];

export function programBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
