import type { Localized, Value } from './types.ts';

export const about = {
  history: [
    {
      id: 'Hanna Filia mulai tahun 2003 dari satu ruko di Nagoya dengan dua kelas dan tiga belas siswa. Waktu itu Batam sedang tumbuh cepat — pabrik-pabrik baru buka, orang datang dari seluruh Indonesia, dan hampir semua pekerjaan bagus mensyaratkan bahasa Inggris.',
      en: 'Hanna Filia began in 2003 in a single shophouse in Nagoya, with two classrooms and thirteen students. Batam was growing fast then — new factories were opening, people were arriving from all over Indonesia, and almost every good job asked for English.',
    },
    {
      id: 'Ibu Anna, S.Pd. mendirikan Hanna Filia karena melihat celah yang sama berulang: orang bisa lulus ujian bahasa Inggris tapi diam waktu diajak bicara. Sejak awal kelas di sini dibuat kecil dan banyak bicara.',
      en: 'Anna, S.Pd. founded Hanna Filia after seeing the same gap again and again: people could pass an English exam and still go quiet when spoken to. From the very first class, our classes have been small and full of talking.',
    },
    {
      id: 'Dua dekade kemudian, kami sudah mengajar lebih dari empat ribu siswa, dari anak kelas satu SD sampai insinyur yang mau pindah kerja ke Singapura. Sebagian dari mereka kami antar sampai ke kampus di luar negeri lewat layanan HFOS.',
      en: 'Two decades on, we have taught more than four thousand students, from first-graders to engineers moving to Singapore for work. Some of them we accompanied all the way to a university abroad through our HFOS service.',
    },
  ] as Localized[],

  vision: {
    id: 'Menjadi lembaga bahasa Inggris yang membuat orang Batam berani bicara di mana pun mereka berdiri.',
    en: 'To be the English school that gives the people of Batam the confidence to speak, wherever they find themselves.',
  } as Localized,

  mission: [
    {
      id: 'Mengajar dengan kelas kecil supaya setiap siswa dapat giliran bicara.',
      en: 'Keep classes small so every student gets a turn to speak.',
    },
    {
      id: 'Menyesuaikan materi dengan tujuan nyata siswa: sekolah, kerja, atau keberangkatan.',
      en: 'Match the material to the real goal: school, work, or a flight out.',
    },
    {
      id: 'Menjaga kualitas pengajar lewat pelatihan berkala dan sertifikasi.',
      en: 'Keep teaching quality high through regular training and certification.',
    },
    {
      id: 'Mendampingi siswa sampai tujuannya tercapai, bukan sampai kelasnya habis.',
      en: 'Stay with students until they reach their goal, not until the course runs out.',
    },
  ] as Localized[],

  values: [
    {
      title: { id: 'Bicara dulu.', en: 'Speak first.' },
      body: {
        id: 'Grammar penting, tapi kami mulai dari keberanian membuka mulut.',
        en: 'Grammar matters, but we start with the nerve to open your mouth.',
      },
    },
    {
      title: { id: 'Kelas kecil.', en: 'Small classes.' },
      body: {
        id: 'Maksimal delapan orang, supaya tidak ada yang menghilang di belakang.',
        en: 'Eight people at most, so nobody disappears at the back.',
      },
    },
    {
      title: { id: 'Terukur.', en: 'Measured.' },
      body: {
        id: 'Setiap siswa punya rapor perkembangan tiap dua bulan.',
        en: 'Every student gets a progress report every two months.',
      },
    },
    {
      title: { id: 'Sampai tujuan.', en: 'All the way.' },
      body: {
        id: 'Kami ikut memikirkan apa yang terjadi setelah kursus selesai.',
        en: 'We think about what happens after the course ends, too.',
      },
    },
  ] as Value[],

  facilities: [
    { id: '6 ruang kelas ber-AC', en: '6 air-conditioned classrooms' },
    { id: 'Ruang multimedia untuk latihan listening', en: 'Multimedia room for listening practice' },
    { id: 'Perpustakaan mini dengan 400+ buku berbahasa Inggris', en: 'Mini library with 400+ English books' },
    { id: 'Ruang tunggu orang tua', en: 'Waiting area for parents' },
    { id: 'WiFi', en: 'WiFi' },
    { id: 'Parkir', en: 'Parking' },
  ] as Localized[],
};

export const crossProgramBenefits: Localized[] = [
  { id: 'Tes penempatan gratis sebelum mendaftar', en: 'Free placement test before you enrol' },
  { id: 'Kelas percobaan gratis satu sesi', en: 'One free trial session' },
  { id: 'Sertifikat di akhir setiap level', en: 'A certificate at the end of every level' },
  {
    id: 'Diskon 10% untuk dua orang atau lebih dari satu keluarga',
    en: '10% discount for two or more people from the same family',
  },
];
