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
 * home / school / flight / photo / chat are the five bottom-nav icons. Their
 * paths are the official Google Material Symbols (Apache-2.0), which are drawn
 * on an `0 -960 960 960` grid rather than the classic `0 0 24 24` grid. That
 * viewBox is declared per-icon in VIEWBOXES below, so these professional glyphs
 * coexist with the hand-drawn 24×24 icons (phone, mail, etc.) without either
 * needing to change. Source: github.com/google/material-design-icons.
 */
const PATHS: Record<IconName, [string, string]> = {
  home: [
    'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Z',
    'M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z',
  ],
  school: [
    'M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Z',
    'M840-280v-276L480-360 40-600l440-240 440 240v320h-80ZM480-120 200-272v-200l280 152 280-152v200L480-120Z',
  ],
  flight: [
    'M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40Z',
    'M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40Z',
  ],
  photo: [
    'M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Z',
    'M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z',
  ],
  chat: [
    'M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Z',
    'M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm160-320h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Z',
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

// The five Material Symbols nav icons are drawn on Google's `0 -960 960 960`
// grid; every other icon uses the classic `0 0 24 24` grid. Anything not listed
// here falls back to 24×24, so adding a new 24×24 icon needs no entry.
const MATERIAL_VIEWBOX = '0 -960 960 960';
const VIEWBOXES: Partial<Record<IconName, string>> = {
  home: MATERIAL_VIEWBOX,
  school: MATERIAL_VIEWBOX,
  flight: MATERIAL_VIEWBOX,
  photo: MATERIAL_VIEWBOX,
  chat: MATERIAL_VIEWBOX,
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
      viewBox={VIEWBOXES[name] ?? '0 0 24 24'}
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
