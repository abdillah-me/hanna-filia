import type { Testimonial } from './types.ts';

export const testimonials: Testimonial[] = [
  {
    name: 'Yuliana',
    role: { id: 'orang tua siswa English for Kids', en: 'parent of an English for Kids student' },
    quote: {
      id: 'Anak saya dulu nilai bahasa Inggrisnya pas-pasan dan malu bicara. Enam bulan di sini dia yang jadi juru bicara kelompok waktu presentasi sekolah.',
      en: 'My son used to scrape by in English and was too shy to speak. Six months here and he was the one presenting for his group at school.',
    },
  },
  {
    name: 'Rian Pratama',
    role: { id: 'alumni TOEFL Preparation', en: 'TOEFL Preparation alumnus' },
    quote: {
      id: 'Saya butuh TOEFL 550 buat syarat beasiswa dan cuma punya waktu dua bulan. Dapat 573. Yang paling ngebantu itu simulasi tesnya, bukan materinya.',
      en: 'I needed a TOEFL 550 for a scholarship and had two months. I got 573. The mock tests helped more than the material did.',
    },
  },
  {
    name: 'Hendra Kusuma',
    role: {
      id: 'Production Supervisor, alumni Business English',
      en: 'Production Supervisor, Business English alumnus',
    },
    quote: {
      id: 'Kerja saya banyak meeting sama vendor Singapura. Dulu saya cuma ngangguk. Sekarang saya yang mimpin meetingnya.',
      en: 'My job is full of meetings with Singaporean vendors. I used to just nod along. Now I run the meeting.',
    },
  },
];

export const hfosTestimonial: Testimonial = {
  name: 'Keluarga Tanuwijaya',
  role: { id: 'klien HFOS', en: 'HFOS client' },
  quote: {
    id: 'Kami sekeluarga nggak ngerti apa-apa soal kuliah di Australia. Bu Sri yang urus dari nyari kampus sampai anak saya dapat kamar di Melbourne.',
    en: 'Our family knew nothing about studying in Australia. Sri handled everything, from finding the university to getting our daughter a room in Melbourne.',
  },
};
