import { ImageResponse } from 'next/og';

// Apple touch icon. Apple devices ignore SVG favicons, so this generates a
// 180×180 PNG at build time via next/og — same crimson "HF" mark as icon.svg,
// no binary asset to hand-maintain. Colours match the Material 3 tokens
// (primary background, on-primary text). Next.js wires up the <link> tag.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#A21C42',
          color: '#FFFDFA',
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -3,
          fontFamily: 'sans-serif',
        }}
      >
        HF
      </div>
    ),
    size,
  );
}
