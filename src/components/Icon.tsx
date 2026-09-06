import type { SVGProps } from 'react';

export type IconName =
  | 'home' | 'school' | 'flight' | 'photo' | 'chat'
  | 'arrow_right' | 'arrow_left' | 'check' | 'add' | 'remove'
  | 'language' | 'phone' | 'mail' | 'instagram' | 'facebook'
  | 'clock' | 'pin' | 'menu';

/**
 * [outlined, filled]. Icons without a filled variant repeat the outlined path
 * (the `filled` prop is a no-op for those — see the ternary below).
 *
 * home / school / flight / photo / chat are the five bottom-nav icons, so
 * their outlined and filled paths are deliberately drawn as two different
 * shapes (a hollow line-art glyph vs a solid silhouette) rather than reusing
 * one path — that visual difference is what makes the active nav item read.
 */
const PATHS: Record<IconName, [string, string]> = {
  home: [
    // Outlined: a hollow roof ring (two nested, oppositely-wound triangles),
    // two wall corner-posts, and a solid door block.
    'M12 4 20.5 11 3.5 11Z M12 6.1 7.3 9.95 16.7 9.95Z M4 11h1.8v9H4Z M18.2 11H20v9h-1.8Z M10 15h4v5h-4Z',
    // Filled: solid house silhouette with the door cut into the outline.
    'M4 20v-9.5L12 4l8 6.5V20h-6v-6h-4v6H4Z',
  ],
  school: [
    // Outlined: a hollow mortarboard ring (two nested, oppositely-wound
    // quadrilaterals), the hanging tassel cord, and a solid headband bar.
    'M12 4 2 9 12 14 20 10Z M11.8 6.4 16.2 9.7 11.8 11.9 6.3 9.1Z M20 10v6h2V9Z M6 15h12v2.5H6Z',
    // Filled: solid mortarboard with headband.
    'M12 4 2 9l10 5 8-4v6h2V9L12 4Zm-6 8.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z',
  ],
  flight: [
    // Outlined: a hollow dart/paper-plane ring (two nested, oppositely-wound
    // triangles) plus a small solid tailfin accent.
    'M21 6 4 10 9 17Z M16.2 8.5 10.2 14 7.7 10.5Z M9 17 13 17 11 20Z',
    // Filled: solid jet silhouette.
    'M10.2 3.6a1.6 1.6 0 0 1 3.1 0L14.8 10l6.4 3.1v2l-6.6-1.6-.9 4.3 2.3 1.7v1.4L12 20l-4 .9v-1.4l2.3-1.7-.9-4.3-6.6 1.6v-2L9.2 10l1-6.4Z',
  ],
  photo: [
    'M4 5h16v14H4V5Zm2 2v8.2l3.3-3.3 3 3L15 12l3 3V7H6Z',
    'M4 5h16v14H4V5Zm2 10.2 3.3-3.3 3 3L15 12l3 3v2H6v-1.8Z',
  ],
  chat: [
    'M4 4h16v12H7.5L4 19.5V4Zm2 2v9l.7-.7L7.3 14H18V6H6Z',
    'M4 4h16v12H7.5L4 19.5V4Z',
  ],
  arrow_right: ['M12.5 5 19 11.5 12.5 18l-1.4-1.4 4.1-4.1H5v-2h10.2l-4.1-4.1L12.5 5Z', ''],
  arrow_left: ['M11.5 5 5 11.5 11.5 18l1.4-1.4-4.1-4.1H19v-2H8.8l4.1-4.1L11.5 5Z', ''],
  check: ['M9.6 16.6 5 12l1.4-1.4 3.2 3.2 8-8L19 7.2l-9.4 9.4Z', ''],
  add: ['M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z', ''],
  remove: ['M5 11h14v2H5v-2Z', ''],
  language: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2c1 0 2.2 1.7 2.7 4.3H9.3C9.8 6.7 11 5 12 5ZM5.3 10h2.8a17 17 0 0 0 0 4H5.3a7 7 0 0 1 0-4Zm.9 6h2.2c.3 1.3.8 2.4 1.3 3.2A7 7 0 0 1 6.2 16Zm1.9-8H6.2a7 7 0 0 1 3.5-3.2C9.2 5.6 8.7 6.7 8.4 8Zm3.6 11c-1 0-2.2-1.7-2.7-4.3h5.4C14.2 17.3 13 19 12 19Zm3-5H9a15 15 0 0 1 0-4h6a15 15 0 0 1 0 4Zm.6 5.2c.5-.8 1-1.9 1.3-3.2h2.2a7 7 0 0 1-3.5 3.2Zm.3-11.2c-.3-1.3-.8-2.4-1.3-3.2A7 7 0 0 1 17.8 8h-1.9Zm2.8 6h-2.8a17 17 0 0 0 0-4h2.8a7 7 0 0 1 0 4Z',
    '',
  ],
  phone: ['M6.6 3h3.2l1.6 4-2 1.5a12 12 0 0 0 5.1 5.1l1.5-2 4 1.6v3.2c0 .8-.7 1.5-1.5 1.5A16.5 16.5 0 0 1 5 5.5C5 4.7 5.7 4 6.6 4V3Z', ''],
  mail: ['M3 5h18v14H3V5Zm2.4 2L12 11.6 18.6 7H5.4ZM5 8.6V17h14V8.6l-7 4.9-7-4.9Z', ''],
  instagram: [
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.2 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
    '',
  ],
  facebook: ['M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.2-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H7.5v3h2.7v8h3.3Z', ''],
  clock: ['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-1 3h2v4.6l3.2 1.9-1 1.7L11 13.5V8Z', ''],
  pin: ['M12 2c3.9 0 7 3.1 7 7 0 5.2-7 13-7 13S5 14.2 5 9c0-3.9 3.1-7 7-7Zm0 4.5A2.5 2.5 0 1 0 12 11a2.5 2.5 0 0 0 0-5Z', ''],
  menu: ['M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z', ''],
};

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  filled?: boolean;
  size?: number;
};

export function Icon({ name, filled = false, size = 24, className, ...rest }: Props) {
  const [outlined, filledPath] = PATHS[name];
  const d = filled && filledPath ? filledPath : outlined;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
