import type { Localized } from './types.ts';

export type ImageEntry = {
  /** Path under /public, or an absolute URL. Empty string = no photo yet. */
  src: string;
  /** CSS aspect-ratio value, e.g. '4/3'. See the comment on `images` below
   *  before changing this. */
  ratio: string;
  alt: Localized;
};

/**
 * The single place a photograph is swapped.
 *
 * To use a real photo: save it as public/images/<key>.jpg (overwriting the
 * placeholder) and leave this file alone. Only change `src` here if you want a
 * different filename or extension.
 *
 * `ratio` is the SLOT's shape — a design decision, not a measurement of the
 * file. `object-cover` (see PhotoSlot) always crops the photograph to fill
 * that shape without distortion. Do not "correct" ratio to match whatever
 * placeholder happens to be sitting in the slot: every future photo the
 * client drops in must land in the same shape, or the whole page reflows
 * every time a photo is swapped.
 */
export const images = {
  'building-front': {
    src: '/images/building-front.jpg', ratio: '4/3',
    alt: { id: 'Gedung Hanna Filia di Nagoya Newton, Batam', en: 'The Hanna Filia building at Nagoya Newton, Batam' },
  },
  'class-kids': {
    src: '/images/class-kids.jpg', ratio: '4/3',
    alt: { id: 'Anak-anak membaca buku bersama di kelas English for Kids', en: 'Children reading together in an English for Kids class' },
  },
  'class-teens': {
    src: '/images/class-teens.jpg', ratio: '4/3',
    alt: { id: 'Siswa remaja berdiskusi di meja kelas', en: 'Teenage students working together at a classroom table' },
  },
  'class-conversation': {
    src: '/images/class-conversation.jpg', ratio: '4/3',
    alt: { id: 'Sekelompok orang mengobrol santai', en: 'A group of people in relaxed conversation' },
  },
  'class-toefl': {
    src: '/images/class-toefl.jpg', ratio: '4/3',
    alt: { id: 'Seseorang mengerjakan latihan soal di buku tulis', en: 'Someone working through practice questions in a notebook' },
  },
  'class-business': {
    src: '/images/class-business.jpg', ratio: '4/3',
    alt: { id: 'Rapat kerja di meja panjang dengan laptop', en: 'A work meeting around a long table with laptops' },
  },
  'hfos-hero': {
    src: '/images/hfos-hero.jpg', ratio: '16/9',
    alt: { id: 'Mahasiswa berjalan di area kampus', en: 'Students walking across a university campus' },
  },
  'gallery-kids-class': {
    src: '/images/gallery-kids-class.jpg', ratio: '4/3',
    alt: { id: 'Anak membaca buku di meja kayu', en: 'A child reading a book at a wooden table' },
  },
  'gallery-phonics': {
    src: '/images/gallery-phonics.jpg', ratio: '4/3',
    alt: { id: 'Anak-anak berdiri di depan rak buku', en: 'Children standing in front of a bookshelf' },
  },
  'gallery-teens-discussion': {
    src: '/images/gallery-teens-discussion.jpg', ratio: '4/3',
    alt: { id: 'Dua siswa belajar bersama sambil tersenyum', en: 'Two students smiling while studying together' },
  },
  'gallery-teens-presentation': {
    src: '/images/gallery-teens-presentation.jpg', ratio: '16/9',
    alt: { id: 'Seseorang presentasi di depan peserta yang duduk', en: 'Someone presenting to a seated audience' },
  },
  'gallery-conversation-roleplay': {
    src: '/images/gallery-conversation-roleplay.jpg', ratio: '4/3',
    alt: { id: 'Dua orang membaca buku bersama', en: 'Two people reading a book together' },
  },
  'gallery-native-speaker': {
    src: '/images/gallery-native-speaker.jpg', ratio: '16/9',
    alt: { id: 'Diskusi kelompok di ruang rapat', en: 'A group discussion in a meeting room' },
  },
  'gallery-toefl-simulation': {
    src: '/images/gallery-toefl-simulation.jpg', ratio: '4/3',
    alt: { id: 'Seseorang menulis di meja belajar dengan tumpukan buku', en: 'Someone writing at a desk stacked with books' },
  },
  'gallery-business-inhouse': {
    src: '/images/gallery-business-inhouse.jpg', ratio: '16/9',
    alt: { id: 'Peserta rapat mencatat di meja', en: 'Meeting participants taking notes at a table' },
  },
  'gallery-english-camp': {
    src: '/images/gallery-english-camp.jpg', ratio: '16/9',
    alt: { id: 'Sekelompok orang duduk di bangku taman', en: 'A group sitting on benches among trees' },
  },
  'gallery-graduation': {
    src: '/images/gallery-graduation.jpg', ratio: '4/3',
    alt: { id: 'Kerumunan toga wisuda dilihat dari belakang', en: 'A crowd of graduation caps and gowns, seen from behind' },
  },
  'gallery-speaking-day': {
    src: '/images/gallery-speaking-day.jpg', ratio: '4/3',
    alt: { id: 'Tiga orang berbincang di meja perpustakaan', en: 'Three people talking at a library table' },
  },
  'gallery-study-tour': {
    src: '/images/gallery-study-tour.jpg', ratio: '16/9',
    alt: { id: 'Rombongan berkumpul di area terbuka', en: 'A group gathered in an open area' },
  },
  'article-1': {
    src: '/images/article-1.jpg', ratio: '16/9',
    alt: { id: 'Seseorang membaca di ruang kuliah yang kosong', en: 'Someone reading in an empty lecture hall' },
  },
  'article-2': {
    src: '/images/article-2.jpg', ratio: '16/9',
    alt: { id: 'Seseorang menulis di buku terbuka', en: 'Someone writing in an open notebook' },
  },
  'article-3': {
    src: '/images/article-3.jpg', ratio: '16/9',
    alt: { id: 'Dua orang membaca dan menulis di meja luar ruangan', en: 'Two people reading and writing at an outdoor table' },
  },

  // Teacher portraits render as initials until a real photograph is supplied.
  // See public/images/CREDITS.md for why these are deliberately empty.
  'teacher-1': { src: '', ratio: '1/1', alt: { id: 'Foto Anna, S.Pd.', en: 'Photograph of Anna, S.Pd.' } },
  'teacher-2': { src: '', ratio: '1/1', alt: { id: 'Foto Rachel Simorangkir', en: 'Photograph of Rachel Simorangkir' } },
  'teacher-3': { src: '', ratio: '1/1', alt: { id: 'Foto Daniel Whitmore', en: 'Photograph of Daniel Whitmore' } },
  'teacher-4': { src: '', ratio: '1/1', alt: { id: 'Foto Fitriani Nasution', en: 'Photograph of Fitriani Nasution' } },
  'teacher-5': { src: '', ratio: '1/1', alt: { id: 'Foto Marcus Tanjung', en: 'Photograph of Marcus Tanjung' } },
  'teacher-6': { src: '', ratio: '1/1', alt: { id: 'Foto Sri Wahyuni', en: 'Photograph of Sri Wahyuni' } },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;
