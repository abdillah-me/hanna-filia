import type { Teacher } from './types.ts';

export const teachers: Teacher[] = [
  {
    initials: 'AN', name: 'Anna, S.Pd.', imageKey: 'teacher-1',
    role: { id: 'Pendiri & Direktur', en: 'Founder & Director' },
    credential: {
      id: 'S.Pd. Pendidikan Bahasa Inggris, 25 tahun mengajar',
      en: 'B.Ed. in English Education, 25 years of teaching',
    },
    quote: {
      id: 'Saya masih ingat nama tiga belas siswa pertama kami.',
      en: 'I still remember the names of our first thirteen students.',
    },
  },
  {
    initials: 'RS', name: 'Rachel Simorangkir', imageKey: 'teacher-2',
    role: { id: 'Koordinator Akademik', en: 'Academic Coordinator' },
    credential: {
      id: 'S.S. Sastra Inggris, sertifikasi TEFL',
      en: 'B.A. in English Literature, TEFL certified',
    },
    quote: {
      id: 'Kalau siswa belum berani bicara, berarti kelasnya yang perlu diubah.',
      en: 'If a student is not speaking up yet, it is the class that needs changing.',
    },
  },
  {
    initials: 'DW', name: 'Daniel Whitmore', imageKey: 'teacher-3',
    role: { id: 'Pengajar Conversation', en: 'Conversation Teacher' },
    credential: {
      id: 'Penutur asli, Australia, sertifikasi CELTA',
      en: 'Native speaker, Australia, CELTA certified',
    },
    quote: {
      id: 'Nobody learns a language quietly.',
      en: 'Nobody learns a language quietly.',
    },
  },
  {
    initials: 'FN', name: 'Fitriani Nasution', imageKey: 'teacher-4',
    role: { id: 'Pengajar TOEFL & IELTS', en: 'TOEFL & IELTS Teacher' },
    credential: { id: 'S.Pd., skor IELTS 8.0', en: 'B.Ed., IELTS band 8.0' },
    quote: {
      id: 'Tes itu punya pola. Begitu tahu polanya, sisanya latihan.',
      en: 'These tests have patterns. Once you see the pattern, the rest is practice.',
    },
  },
  {
    initials: 'MT', name: 'Marcus Tanjung', imageKey: 'teacher-5',
    role: { id: 'Pengajar Kids', en: 'Kids Teacher' },
    credential: {
      id: 'S.Pd. PGSD, sertifikasi TEYL',
      en: 'B.Ed. in Primary Education, TEYL certified',
    },
    quote: {
      id: 'Anak-anak belajar paling cepat kalau mereka lupa sedang belajar.',
      en: 'Children learn fastest when they forget they are learning.',
    },
  },
  {
    initials: 'SW', name: 'Sri Wahyuni', imageKey: 'teacher-6',
    role: { id: 'Konselor HFOS', en: 'HFOS Counsellor' },
    credential: {
      id: 'Pengalaman 8 tahun penempatan studi luar negeri',
      en: '8 years placing students in universities abroad',
    },
    quote: {
      id: 'Bagian paling sulit biasanya bukan kampusnya, tapi berkasnya.',
      en: 'The hard part is rarely the university. It is the paperwork.',
    },
  },
];
