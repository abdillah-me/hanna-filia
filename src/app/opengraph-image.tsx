import { ImageResponse } from 'next/og';

// Share-preview image for every page (WhatsApp, Facebook, X). Generated at
// build time like apple-icon.tsx; colours match the Material 3 tokens.
// Replace with a real photograph of a class once one exists.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Hanna Filia English Course — Batam';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 96,
          background: '#A21C42',
          color: '#FFFDFA',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, color: '#F2C230', letterSpacing: 3 }}>
          NAGOYA, BATAM · SEJAK 2003
        </div>
        <div style={{ marginTop: 28, fontSize: 104, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>
          Hanna Filia English Course
        </div>
        <div style={{ marginTop: 36, fontSize: 40, color: '#F5D6AE' }}>
          Kelas kecil · Pengajar bersertifikat · Kids sampai TOEFL &amp; IELTS
        </div>
      </div>
    ),
    size,
  );
}
