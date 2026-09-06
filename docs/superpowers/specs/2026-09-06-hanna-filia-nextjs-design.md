# Hanna Filia — Website Next.js + Material 3

**Tanggal:** 2026-09-06
**Status:** Disetujui, siap masuk rencana implementasi
**Menggantikan:** `LKP Hanna Filia - Website.html` (bundle Claude Design `<x-dc>`)

---

## 1. Latar belakang

Situs sekarang berbentuk satu file HTML 906 KB berisi bundle self-extracting:
manifest 25 aset (1 logo PNG, 24 file font, React 18 UMD) plus template 104 KB
yang dijalankan runtime kustom `<x-dc>` dengan DSL `sc-for` / `sc-if` /
`sc-camel-on-click`. Markup dan logika tidak terpisah — style di-generate sebagai
string di dalam JavaScript (`rowStyle`, `barStyle`, `cellStyle`).

Tidak ada bagian markup yang bisa dipindahkan langsung. Yang dipertahankan dari
sumber lama adalah **konten dan datanya**, yang sudah diekstrak lengkap:
5 program, 6 pengajar, 7 FAQ, 6 langkah HFOS, 12 slot galeri, 3 testimoni,
4 misi, 4 nilai, 6 fasilitas, 7 negara tujuan, 3 artikel placeholder, jam
operasional, dan data kontak.

### Masalah yang harus diselesaikan

| # | Masalah pada situs lama | Konsekuensi |
|---|---|---|
| 1 | Nol media query. Grid `1.12fr/0.88fr`, `repeat(4,1fr)`, `72px …auto` hardcoded | Layout remuk di layar < 900px |
| 2 | 6 link nav `flex-wrap` di header sticky | Menghabiskan setengah viewport HP |
| 3 | Routing palsu (`state.route`), semua halaman satu URL | Tidak bisa dibagikan, tidak terindeks, tombol back mati |
| 4 | Styling inline string di JS | Tidak reusable, tidak ada hover/focus asli |
| 5 | Ikon SVG mentah tanpa grid konsisten | Tidak rapi saat diperbesar |
| 6 | 20+ slot foto masih kotak sand berlabel teks | Situs terasa belum jadi |
| 7 | Form hanya `setState({sent:true})` | Data pendaftaran hilang |
| 8 | `href="#"` untuk semua aksi; FAQ tanpa `aria-expanded`; `#8A7C74` di cream = 3.97:1 | Gagal WCAG AA |
| 9 | Hanya Bahasa Indonesia | Tidak menjangkau ekspat dan calon siswa internasional |

### Keputusan yang sudah diambil

1. **Arah visual:** Material 3 sebagai fondasi sistem, karakter brand dipertahankan.
2. **Form:** WhatsApp deep link, tanpa backend.
3. **Foto:** foto Unsplash asli lewat `next/image`, dengan manifest satu file agar mudah diganti.
4. **Bahasa Inggris:** seluruh copy diterjemahkan sekarang.

---

## 2. Tech stack

| Bagian | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 15 App Router, TypeScript `strict` | Diminta klien |
| Styling | Tailwind CSS v4, token M3 di `@theme` | CSS-first, token jadi utility otomatis, jauh lebih sedikit CSS tulis tangan untuk 13 halaman |
| Material 3 | Token CSS custom property + komponen React sendiri | `@material/web` adalah Web Components: rewel di SSR, memaksa `'use client'`, bundle besar. Token murni memberi presisi sama dengan berat jauh lebih kecil |
| i18n | `next-intl` v4 | Mendukung Server Components; halaman tidak perlu jadi client component hanya untuk terjemahan |
| Font | `next/font/google` | Self-host otomatis, nol layout shift |
| Ikon | SVG inline sendiri, satu file | Font Material Symbols variable ±3 MB dan tidak bisa di-subset oleh `next/font` |
| Foto | `next/image` + `images.unsplash.com` | Optimasi, lazy-load, `sizes` responsif |
| Test | `node:test` bawaan Node | Tidak perlu framework untuk 4 invariant |

**Dependency runtime: `next`, `react`, `react-dom`, `next-intl`.**
Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `@types/*`, `eslint-config-next`.
Tidak ada UI library, state manager, atau animation library.

### Yang secara eksplisit TIDAK dibangun

- CMS atau admin panel — konten diedit langsung di file TypeScript
- Navigation Rail M3 untuk tablet — dua layout sudah menutup semua ukuran; rail adalah layout ketiga yang harus dirawat
- Dark mode — token disusun berpasangan agar murah ditambahkan nanti, tapi tidak termasuk sekarang
- Isi halaman Artikel — tetap placeholder, memang ditandai "fase dua" di sumber asli
- FAB — item nav "Kontak" sudah menjadi CTA; FAB di atas bottom nav terlalu ramai
- Backend, database, autentikasi, analytics

---

## 3. Sistem Material 3

Seluruh token ditulis di `src/styles/tokens.css` sebagai CSS custom property dan
diekspos ke Tailwind lewat `@theme`. File itu adalah satu-satunya sumber
kebenaran tampilan.

### 3.1 Color — skema light, seed `#A21C42`

Semua rasio di bawah sudah diverifikasi (lihat §8.1).

| Peran M3 | Hex | Rasio terhadap pasangannya |
|---|---|---|
| `primary` | `#A21C42` | 7.44:1 di atas surface |
| `on-primary` | `#FFFDFA` | 7.44:1 |
| `primary-container` | `#FFD9DF` | — |
| `on-primary-container` | `#3F0014` | 13.30:1 |
| `secondary` | `#77574A` | — |
| `on-secondary` | `#FFFFFF` | 6.47:1 |
| `secondary-container` | `#F5D6AE` (sand brand) | — |
| `on-secondary-container` | `#2C160C` | 12.31:1 |
| `tertiary` | `#725C00` | — |
| `on-tertiary` | `#FFFFFF` | 6.47:1 |
| `tertiary-container` | `#F2C230` (gold brand) | — |
| `on-tertiary-container` | `#231B00` | 10.21:1 |
| `error` | `#BA1A1A` | — |
| `on-error` | `#FFFFFF` | 6.46:1 |
| `error-container` | `#FFDAD6` | — |
| `on-error-container` | `#410002` | 13.26:1 |
| `surface` | `#FFFDFA` (cream brand) | — |
| `on-surface` | `#1C1A19` (ink brand) | 17.08:1 |
| `on-surface-variant` | `#5C5350` | 7.37:1 |
| `surface-container-lowest` | `#FFFFFF` | — |
| `surface-container-low` | `#FBF4F0` | — |
| `surface-container` | `#F6EEE9` | — |
| `surface-container-high` | `#F0E8E3` | — |
| `surface-container-highest` | `#EAE2DD` | — |
| `outline` | `#7C716D` | 4.66:1 |
| `outline-variant` | `#D5C7C2` | 1.62:1 (dekoratif) |
| `inverse-surface` | `#312F2E` | — |
| `inverse-on-surface` | `#F5EFEC` | 11.70:1 |
| `inverse-primary` | `#FFB2BF` | — |
| `scrim` | `#000000` | dipakai pada 32% |

**Perubahan wajib dari situs lama:** teks muted `#8A7C74` (3.97:1, gagal AA)
diganti `on-surface-variant #5C5350` (7.37:1).

**Pasangan brand non-standar yang harus dijaga:** `tertiary-container #F2C230`
di atas `primary #A21C42` = **4.51:1**. Dipakai untuk badge "Gratis" dan
"Level N". Lolos hanya untuk teks besar/bold (min 3:1). **Gold di atas crimson
dilarang untuk teks di bawah 18px atau di bawah weight 700.**

### 3.2 Shape

Dituning tegas, bukan bulat ala Android:

```
--md-sys-shape-corner-none:  0
--md-sys-shape-corner-xs:    2px
--md-sys-shape-corner-sm:    4px
--md-sys-shape-corner-md:    8px
--md-sys-shape-corner-lg:   12px
--md-sys-shape-corner-xl:   16px
--md-sys-shape-corner-full: 9999px
```

Pemakaian: kartu `sm`–`md`, chip/filter `full`, dialog `lg`, sheet `xl`,
tombol `sm`. Border 1.5px `on-surface` tetap dipertahankan pada kartu, tombol
outlined, dan input — ini tanda tangan visual brand dan alasan situs ini tidak
terlihat seperti template Google.

### 3.3 Typography

Skala M3 dipetakan ke font yang sudah dipakai brand.

| Token M3 | Font | Ukuran | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| `display-large` | Archivo | `clamp(38px, 5vw, 64px)` | 800 | 1.04 | -0.02em |
| `display-medium` | Archivo | `clamp(32px, 4.4vw, 56px)` | 800 | 1.06 | -0.02em |
| `display-small` | Archivo | `clamp(28px, 3.4vw, 44px)` | 800 | 1.10 | -0.02em |
| `headline-large` | Archivo | 32px | 800 | 1.12 | -0.02em |
| `headline-medium` | Archivo | 28px | 800 | 1.15 | -0.02em |
| `headline-small` | Archivo | 24px | 800 | 1.20 | -0.01em |
| `title-large` | Archivo | 20px | 700 | 1.25 | -0.01em |
| `title-medium` | Archivo | 17px | 700 | 1.30 | 0 |
| `title-small` | Archivo | 15px | 700 | 1.35 | 0 |
| `body-large` | Source Sans 3 | 17px | 400 | 1.65 | 0 |
| `body-medium` | Source Sans 3 | 16px | 400 | 1.55 | 0 |
| `body-small` | Source Sans 3 | 15px | 400 | 1.50 | 0 |
| `label-large` | Archivo | 15px | 700 | 1.20 | 0 |
| `label-medium` | Archivo | 13px | 700 | 1.20 | 0.09em, uppercase |
| `label-small` | Archivo | 11px | 700 | 1.20 | 0.09em, uppercase |

**Di luar skala M3, dua token tambahan:**

| Token | Font | Ukuran | Weight | Catatan |
|---|---|---|---|---|
| `quote` | Newsreader italic | `clamp(20px, 2.4vw, 28px)` | 400 | Testimoni, visi, kalimat pengajar. Identitas brand; M3 tidak punya slot serif |
| `label-nav` | Archivo | 12px | 500 → 700 aktif | Label bottom navigation, **tanpa uppercase** |

`label-nav` terpisah karena `label-medium` di sistem ini sudah dipakai sebagai
gaya eyebrow brand (13px, weight 700, uppercase, tracking 0.09em). Label
navigation bar M3 tidak uppercase dan membedakan weight antara state normal dan
aktif — dua kebutuhan yang bertabrakan, jadi tidak boleh berbagi token.

### 3.4 Motion

Token M3 asli, tanpa modifikasi:

```
--md-sys-motion-easing-emphasized:            cubic-bezier(0.2, 0, 0, 1)
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1)
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15)
--md-sys-motion-easing-standard:              cubic-bezier(0.2, 0, 0, 1)
--md-sys-motion-easing-standard-decelerate:   cubic-bezier(0, 0, 0, 1)
--md-sys-motion-easing-standard-accelerate:   cubic-bezier(0.3, 0, 1, 1)
--md-sys-motion-duration-short2:  100ms
--md-sys-motion-duration-short4:  200ms
--md-sys-motion-duration-medium2: 300ms
--md-sys-motion-duration-medium4: 400ms
--md-sys-motion-duration-long2:   500ms
```

Aturan pemakaian:
- Masuk (enter) → `emphasized-decelerate`, durasi `medium2`–`medium4`
- Keluar (exit) → `emphasized-accelerate`, durasi `short4`
- Perubahan state (hover, indicator, akordeon) → `standard`, `short4`

`emphasized` dan `standard` sengaja bernilai sama. Kurva emphasized asli di
spec M3 adalah spline dua segmen yang tidak bisa dinyatakan sebagai satu
`cubic-bezier` CSS; `cubic-bezier(0.2, 0, 0, 1)` adalah aproksimasi resmi yang
dipakai M3 sendiri di web. Keduanya tetap ditulis sebagai dua token terpisah
agar niatnya terbaca di kode dan bisa dibedakan bila suatu saat dianimasikan
lewat Web Animations API yang mendukung spline multi-segmen.

Seluruh animasi berada di bawah `@media (prefers-reduced-motion: reduce)` yang
mematikan `animation` dan `transition`. Reveal saat scroll tetap menampilkan
konten (opacity 1), hanya gerakannya yang hilang — konten tidak boleh pernah
tersembunyi permanen karena preferensi ini.

### 3.5 State layer

Overlay `::after` dengan `background: currentColor` dan opacity:

```
hover 0.08 · focus 0.10 · pressed 0.10 · dragged 0.16
```

Diterapkan lewat satu utility class, **bukan** dengan mengganti `background`
properti elemen. Ini yang membuat interaksi terasa konsisten di semua komponen
dan tetap benar di atas surface apa pun.

### 3.6 Elevation

Level 0–5 M3, dipakai hemat:

| Level | Pemakaian |
|---|---|
| 0 | Permukaan datar, default |
| 1 | Kartu saat hover |
| 2 | Bottom navigation bar, top app bar saat halaman ter-scroll |
| 3 | Dialog, menu |
| 4–5 | Tidak dipakai |

---

## 4. Arsitektur

### 4.1 Struktur direktori

```
src/
  app/
    [locale]/
      layout.tsx              root shell: font, NextIntlClientProvider, nav
      page.tsx                Beranda
      about/page.tsx          Tentang
      programs/page.tsx       Daftar program
      programs/[slug]/page.tsx   Detail program (5 slug)
      study-abroad/page.tsx   HFOS
      teachers/page.tsx       Pengajar
      gallery/page.tsx        Galeri & kegiatan
      articles/page.tsx       Artikel (placeholder)
      contact/page.tsx        Kontak & pendaftaran
      not-found.tsx
    sitemap.ts
    robots.ts
  components/
    m3/          TopAppBar BottomNav Button Card Chip TextField
                 Accordion Badge StateLayer
    sections/    Hero StatsBar Marquee PathFinder ProgramGrid
                 LevelLadder HfosTeaser Testimonials TrialCta
                 ContactForm Faq PhotoSlot
    Icon.tsx     ~25 path SVG, nav icons berpasangan outlined/filled
    Reveal.tsx   wrapper IntersectionObserver
    LocaleToggle.tsx
  content/
    programs.ts teachers.ts faq.ts hfos.ts gallery.ts
    testimonials.ts articles.ts site.ts images.ts about.ts
    types.ts     tipe Localized<T> dan turunannya
  lib/
    whatsapp.ts  normalisasi nomor + penyusun pesan
    i18n.ts      konfigurasi routing next-intl
  styles/
    tokens.css   SELURUH sistem M3
    globals.css  reset, base, utility state layer, keyframes
messages/
  id.json  en.json
public/images/   tujuan foto pengganti dari klien
test/
  content.test.mjs  invariant konten, i18n, kontras, WhatsApp
```

### 4.2 Routing dan i18n

`next-intl` dengan prefix locale wajib. Default `id`.

```
/id                     /en
/id/about               /en/about
/id/programs            /en/programs
/id/programs/kids       /en/programs/kids
/id/programs/teens      /en/programs/teens
/id/programs/conversation
/id/programs/toefl-ielts
/id/programs/business
/id/study-abroad        /en/study-abroad
/id/teachers            /en/teachers
/id/gallery             /en/gallery
/id/articles            /en/articles
/id/contact             /en/contact
```

**Pathname sama untuk kedua locale** (tidak dilokalkan). Alasan: satu peta rute
untuk dirawat, satu `generateStaticParams` untuk slug program, dan pergantian
bahasa cukup mengganti segmen pertama tanpa tabel pemetaan. `/` di-redirect ke
`/id` oleh middleware.

Setiap halaman mengekspor `generateMetadata` dengan title, description,
`openGraph`, dan `alternates.languages` untuk `id` dan `en` — ini yang membuat
kedua versi bahasa terindeks terpisah. `<html lang>` mengikuti locale aktif.

Semua halaman statis (`generateStaticParams` untuk locale dan slug), sehingga
seluruh situs ter-prerender saat build.

### 4.3 Pemisahan konten dan string UI

Dua tempat, dengan aturan yang jelas:

**`messages/{id,en}.json`** — string UI datar: label nav, teks tombol, label
field form, pesan validasi, judul seksi. Diakses lewat `useTranslations` /
`getTranslations`.

**`src/content/*.ts`** — konten terstruktur dengan tipe:

```ts
export type Localized = { id: string; en: string };

export type Program = {
  slug: 'kids' | 'teens' | 'conversation' | 'toefl-ielts' | 'business';
  n: 1 | 2 | 3 | 4 | 5;
  name: Localized;
  audience: Localized;
  duration: Localized;
  schedule: Localized;
  minutes: Localized;
  summary: Localized;
  syllabus: Localized[];
  outcome: Localized;
  price: Localized;
  imageKey: keyof typeof images;
};
```

Alasan pemisahan: data ini berelasi dan berupa array objek. Di JSON i18n ia
kehilangan struktur dan type-check; sebagai modul TypeScript, terjemahan yang
lupa diisi membuat build gagal, bukan diam-diam menampilkan key mentah.

Helper tunggal: `t(value: Localized, locale: Locale): string`.

### 4.4 Manifest foto

`src/content/images.ts`:

```ts
export const images = {
  'building-front': {
    src: 'https://images.unsplash.com/photo-...',
    ratio: '4/3',
    alt: { id: '...', en: '...' },
  },
  // ...
} as const;
```

`next.config.ts` memuat `remotePatterns` untuk `images.unsplash.com`.

**Cara klien mengganti foto:** taruh file di `public/images/`, ubah satu baris
`src` menjadi `/images/nama-file.jpg`. Tidak ada komponen yang perlu disentuh.
`ratio` dan `alt` tetap berlaku. Ini didokumentasikan di README.

Slot yang harus terisi — **28 total**:

| Key | Rasio | Isi |
|---|---|---|
| `building-front` | 4/3 | Tampak depan Nagoya Newton |
| `class-kids` | 4/3 | Kelas English for Kids |
| `class-teens` | 4/3 | Kelas English for Teens |
| `class-conversation` | 4/3 | Kelas Conversation |
| `class-toefl` | 4/3 | Kelas persiapan tes |
| `class-business` | 4/3 | Kelas Business English |
| `teacher-1` … `teacher-6` | 1/1 | Enam pengajar — **monogram, bukan foto stok** |
| `gallery-*` | 4/3 dan 16/9 | 12 slot galeri sesuai kategori |
| `article-1` … `article-3` | 16/9 | Gambar artikel |
| `hfos-hero` | 16/9 | Ilustrasi studi luar negeri |

Foto Unsplash dipilih yang relevan (ruang kelas, belajar berkelompok, wisuda,
kampus) dan diambil dari wajah yang tidak menjadi subjek utama — suasana, tangan,
buku, ruangan.

### 4.4.1 Pengecualian: enam slot pengajar

Enam slot pengajar **tidak** memakai foto stok, melainkan komponen `Monogram`:
lingkaran `primary-container` dengan inisial nama dalam Archivo 800 di atasnya
(`AN`, `RS`, `DW`, `FN`, `MT`, `SW`), plus pola halus brand.

Alasannya bukan estetika. Enam pengajar di situs ini punya nama, gelar, dan
kutipan pribadi yang nyata — "Anna, S.Pd.", "Daniel Whitmore, sertifikasi
CELTA". Memasang potret orang asing dari Unsplash di sebelah nama-nama itu
membuat situs menampilkan orang yang bukan mereka sebagai staf lembaga. Selama
situs masih di lokal itu hanya placeholder, tapi begitu ter-deploy ia menjadi
klaim palsu tentang orang nyata — dan risiko itu tidak sepadan dengan
keuntungan tampilan sementara.

Monogram terlihat disengaja, bukan seperti slot kosong, dan diganti dengan cara
yang persis sama: taruh foto di `public/images/`, isi field `src` pada entri
`teacher-N`. Begitu `src` terisi, komponen otomatis merender foto, bukan
monogram.

---

## 5. Navigasi dan responsif

Breakpoint tunggal: **`768px`**.

### 5.1 Mobile (< 768px)

**Top app bar** menyusut: logo (tinggi 32px) di kiri, `LocaleToggle` di kanan.
Sticky, `surface`, elevation 0 → naik ke elevation 2 saat `scrollY > 8`.

**M3 Navigation Bar** di bawah:

- Tinggi 80px + `padding-bottom: env(safe-area-inset-bottom)`
- `surface-container`, elevation 2, border-top 1.5px `outline-variant`
- Lima item, `position: fixed; bottom: 0`
- `<body>` diberi `padding-bottom` setara agar konten terakhir tidak tertutup

Lima item:

| Slot | Rute | Ikon |
|---|---|---|
| 1 | `/` | home |
| 2 | `/programs` | school |
| 3 | `/study-abroad` | flight |
| 4 | `/gallery` | photo_library |
| 5 | `/contact` | chat |

Tentang dan Pengajar dijangkau dari top app bar desktop dan footer. Artikel dari
footer dan blok link di Beranda.

**Perilaku item aktif** (inilah yang membuatnya terasa seperti aplikasi):
1. Pill indicator `secondary-container`, lebar 64px, tinggi 32px, radius `full`,
   melebar dari tengah — 240ms `emphasized`
2. Ikon berubah outlined → filled (dua path SVG, cross-fade 100ms)
3. Label `label-nav` naik dari weight 500 ke 700, warna `on-secondary-container`
4. Target sentuh minimum 48×48px

### 5.2 Desktop (≥ 768px)

Top app bar: logo, `LocaleToggle`, dan **enam link nav** — sama persis dengan
navigasi situs lama: Beranda, Tentang, Program, Studi ke Luar Negeri, Pengajar,
Kontak. Galeri dan Artikel hanya di footer dan blok link Beranda.

Enam, bukan delapan: pada 768px, delapan link ditambah logo, toggle bahasa, dan
tombol CTA tidak muat dalam satu baris dan akan `flex-wrap` — persis kegagalan
nomor 2 pada situs lama yang sedang diperbaiki.

Tombol CTA "Daftar Kelas Percobaan" (outlined, border 1.5px) **hanya tampil
≥ 1024px**. Antara 768–1023px ruangnya dipakai untuk enam link; konversi tetap
terjaga lewat link Kontak dan CTA di dalam halaman.

Bottom nav tidak dirender di desktop lewat CSS (`hidden md:block` /
`md:hidden`), bukan JavaScript — agar benar sejak render pertama tanpa flash.

### 5.3 Perbaikan layout per seksi

| Seksi | Lama | Baru |
|---|---|---|
| Hero | `1.12fr / 0.88fr` | 1 kolom < 768px, tangga level pindah ke bawah |
| Stats | `repeat(4, 1fr)` | 2×2 < 768px, divider vertikal jadi horizontal |
| Baris program | `72px 1.1fr 1fr auto` | Kartu bertumpuk < 768px |
| Kartu program | `minmax(300px, 1fr)` | 1 kolom < 640px |
| Grid pengajar | `minmax(320px, 1fr)` | 1 kolom < 640px |
| Filter galeri | `flex-wrap` | Scroll horizontal + snap < 768px |
| Footer | 3 kolom | 1 kolom < 768px |
| Timeline HFOS | Sudah aman | Padding kiri dikurangi < 768px |
| Marquee | Sudah aman | Tetap |

---

## 6. Animasi

| Elemen | Teknik | Token |
|---|---|---|
| Reveal saat scroll | `IntersectionObserver` sekali pakai, `translateY(16px)` → 0 | `medium4`, `emphasized-decelerate` |
| Counter statistik | `requestAnimationFrame` ease-out cubic, dipicu saat masuk viewport | 1100ms |
| Marquee | CSS `@keyframes` translateX(-50%) | 38s linear |
| Tangga level hero | Stagger 80ms per baris, bar `scaleX(0→1)` | `emphasized` |
| Peta rute SVG HFOS | `stroke-dashoffset` 700 → 0, dipicu saat masuk viewport | 1600ms |
| Indicator bottom nav | `transform: scaleX` dari tengah | 240ms `emphasized` |
| Akordeon FAQ | `grid-template-rows: 0fr → 1fr` | `short4` `standard` |
| Hover kartu | State layer 8% + elevation 0 → 1 | `short4` |
| Transisi halaman | View Transitions API, shared-axis M3 | 300ms |

**Catatan teknis akordeon:** `grid-template-rows: 0fr → 1fr` pada wrapper dengan
`overflow: hidden` pada anak menganimasikan tinggi otomatis tanpa mengukur DOM
dan tanpa `max-height` tebakan yang selalu membuat easing terlihat patah.

**View Transitions** hanya aktif di browser yang mendukung; di browser lain
navigasi berjalan normal tanpa transisi. Tidak ada polyfill.

---

## 7. Form pendaftaran → WhatsApp

Satu-satunya logika non-trivial di situs.

### 7.1 Alur

1. Pengguna mengisi: nama (wajib), nomor WhatsApp (wajib), usia (opsional,
   hanya di halaman Kontak), program (select, wajib), pesan (opsional)
2. Validasi di client saat submit
3. Bila valid: buka `https://wa.me/6281270001234?text=<pesan terenkode>`
   di tab baru
4. Bila tidak valid: tampilkan pesan error M3 di bawah field (`error`,
   `body-small`), fokus dipindah ke field pertama yang salah

Tidak ada state "terkirim" palsu seperti di situs lama — pengguna melihat
WhatsApp terbuka, itu konfirmasi yang jujur.

### 7.2 Normalisasi nomor

Masukan pengguna di Indonesia bisa berupa `0812…`, `62812…`, `+62 812…`,
`0812-7000-1234`, atau dengan spasi.

Aturan:
1. Buang semua karakter selain digit dan `+` di depan
2. `+62` di depan → `62`
3. `0` di depan → `62`
4. `8` di depan (tanpa 0) → `628`
5. Hasil harus cocok `^62[0-9]{9,13}$`, kalau tidak → error

### 7.3 Format pesan

```
Halo Hanna Filia, saya ingin mendaftar kelas percobaan.

Nama: {nama}
WhatsApp: {nomor asli yang diketik}
Usia: {usia}            ← baris dilewati bila kosong
Program: {nama program dalam bahasa aktif}
Pesan: {pesan}          ← baris dilewati bila kosong
```

Dienkode dengan `encodeURIComponent`. Teks pembuka mengikuti locale aktif.

---

## 8. Aksesibilitas

Wajib, tidak boleh disederhanakan.

- Semua navigasi memakai `next/link`; semua aksi memakai `<button>`. Tidak ada
  `href="#"` di seluruh codebase.
- FAQ: `<button aria-expanded aria-controls>` + `<div role="region" aria-labelledby>`.
- Filter galeri: `role="tablist"` dengan `aria-selected`, navigasi panah kiri/kanan.
- Bottom nav: `<nav aria-label>` + `aria-current="page"` pada item aktif.
- Skip link ke `<main>` sebagai elemen fokusable pertama.
- Landmark: `<header> <nav> <main> <footer>` di setiap halaman.
- `:focus-visible` = outline 2px `primary`, offset 2px, terlihat di semua surface.
- Target sentuh minimum 48×48px di mobile.
- Semua `next/image` punya `alt` dari manifest, dwibahasa. Gambar dekoratif
  (ikon, SVG hero) diberi `aria-hidden="true"`.
- Kontras: seluruh pasangan `on-*` ≥ 4.5:1, dikunci oleh test.
- Form: setiap input punya `<label>` terkait, error terhubung lewat
  `aria-describedby`, `aria-invalid` saat salah.
- `prefers-reduced-motion` dihormati; konten tetap terlihat.

---

## 9. Test

Satu file, `node:test` bawaan, dijalankan `npm test`. Menguji hal yang benar-benar
bisa rusak diam-diam:

1. **Kelengkapan terjemahan konten** — setiap field `Localized` di seluruh
   `src/content/*.ts` punya `id` dan `en` yang tidak kosong.
2. **Kesamaan key i18n** — himpunan key `messages/id.json` identik dengan
   `messages/en.json` (rekursif, termasuk nested).
3. **Kontras** — seluruh pasangan `on-*` / surface ≥ 4.5:1; pasangan brand
   `tertiary-container` / `primary` ≥ 3:1. Dibaca langsung dari `tokens.css`
   supaya test gagal kalau seseorang mengubah token.
4. **Normalisasi WhatsApp** — tabel kasus: `0812…`, `+62812…`, `62812…`,
   `0812-7000-1234`, `0812 7000 1234`, string kosong, huruf, nomor terlalu
   pendek, nomor terlalu panjang.
5. **Integritas manifest foto** — setiap `imageKey` yang dirujuk konten benar-benar
   ada di `images.ts`.

Ini bukan test coverage; ini lima invariant yang kalau rusak, kerusakannya tidak
terlihat sampai pengunjung yang menemukannya.

### 9.1 Verifikasi kontras yang sudah dijalankan

Seluruh 20 pasangan di §3.1 sudah dihitung dan lolos sebelum spec ini ditulis.
Nilai terendah: `outline`/`surface` 4.66:1 (min 3), dan
`tertiary-container`/`primary` 4.51:1 (min 3, khusus teks besar).

---

## 10. Definisi selesai

- [ ] 13 rute berfungsi di kedua locale, semuanya ter-prerender saat build
- [ ] `npm run build` bersih, `tsc --noEmit` bersih, `npm test` hijau
- [ ] Bottom nav muncul < 768px dengan indicator dan ikon filled berfungsi
- [ ] Tidak ada scroll horizontal pada 320px, 375px, 768px, 1024px, 1440px
- [ ] Semua string tampil dalam dua bahasa, tidak ada key mentah
- [ ] Form membuka WhatsApp dengan pesan terformat benar
- [ ] Seluruh slot foto terisi dan bisa diganti lewat satu baris di `images.ts`
- [ ] `prefers-reduced-motion` mematikan gerakan tanpa menyembunyikan konten
- [ ] README menjelaskan cara ganti foto, ubah teks, dan tambah bahasa

---

## 11. Catatan

- Direktori proyek **bukan repositori git**. Spec ini tidak bisa di-commit.
  Disarankan menjalankan `git init` sebelum implementasi dimulai agar perubahan
  bisa dilacak dan dibatalkan.
- File `LKP Hanna Filia - Website.html` dibiarkan di tempatnya sebagai rujukan;
  tidak dihapus dan tidak diubah.
- Data yang belum tersedia dan tetap ditandai di situs: NILEK/NPSN dan status
  akreditasi BAN PAUD & PNF.
- Harga program disembunyikan secara default (mengikuti flag `tampilkanHarga`
  yang default `false` di situs lama); label yang tampil "Tanya biaya" /
  "Ask for pricing". Harga tetap disimpan di `programs.ts` dan dikendalikan satu
  konstanta.
