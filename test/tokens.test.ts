import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function readToken(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `token --color-${name} not found in tokens.css`);
  return m[1];
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum]
const PAIRS: Array<[string, string, number]> = [
  ['on-primary', 'primary', 4.5],
  ['on-primary-container', 'primary-container', 4.5],
  ['on-secondary', 'secondary', 4.5],
  ['on-secondary-container', 'secondary-container', 4.5],
  ['on-tertiary', 'tertiary', 4.5],
  ['on-tertiary-container', 'tertiary-container', 4.5],
  ['on-error', 'error', 4.5],
  ['on-error-container', 'error-container', 4.5],
  ['on-surface', 'surface', 4.5],
  ['on-surface-variant', 'surface', 4.5],
  ['on-surface', 'surface-container-highest', 4.5],
  ['on-surface-variant', 'surface-container-highest', 4.5],
  ['on-surface', 'secondary-container', 4.5],
  ['on-surface-variant', 'secondary-container', 4.5],
  ['inverse-on-surface', 'inverse-surface', 4.5],
  ['primary', 'surface', 3],
  ['outline', 'surface', 3],
];

for (const [fg, bg, min] of PAIRS) {
  test(`${fg} on ${bg} meets ${min}:1`, () => {
    const r = ratio(readToken(fg), readToken(bg));
    assert.ok(r >= min, `${fg}/${bg} is ${r.toFixed(2)}:1, needs ${min}:1`);
  });
}

// Brand pairing outside the M3 matrix: the gold "Gratis" / "Level N" badge on
// the crimson hero. 4.51:1 passes only for large bold text — this test is the
// reminder that it must never be used for body copy.
test('tertiary-container on primary is large-text-only', () => {
  const r = ratio(readToken('tertiary-container'), readToken('primary'));
  assert.ok(r >= 3, `gold on crimson is ${r.toFixed(2)}:1, needs 3:1`);
  assert.ok(r < 4.5, 'gold on crimson now passes 4.5:1 — relax the ≥18px/700 rule in the spec');
});
