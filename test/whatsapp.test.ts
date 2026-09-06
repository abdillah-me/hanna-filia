import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWhatsApp, buildEnrolmentMessage, buildWhatsAppUrl } from '../src/lib/whatsapp.ts';

test('normalizes Indonesian mobile numbers to E.164', () => {
  const cases: Array<[string, string | null]> = [
    ['081270001234', '6281270001234'],
    ['0812-7000-1234', '6281270001234'],
    ['0812 7000 1234', '6281270001234'],
    ['+62 812 7000 1234', '6281270001234'],
    ['+6281270001234', '6281270001234'],
    ['6281270001234', '6281270001234'],
    ['00６2', null],
    ['0062812 7000 1234', '6281270001234'],
    ['81270001234', '6281270001234'],
    ['', null],
    ['   ', null],
    ['abcdefg', null],
    ['62', null],
    ['0812', null],
    ['081270001234567890', null],
    ['123456789', null],
  ];
  for (const [input, expected] of cases) {
    assert.equal(normalizeWhatsApp(input), expected, `input ${JSON.stringify(input)}`);
  }
});

test('builds a message that skips empty optional lines', () => {
  const msg = buildEnrolmentMessage(
    { name: 'Budi', whatsapp: '0812-7000-1234', program: 'English for Kids' },
    'Halo Hanna Filia, saya ingin mendaftar kelas percobaan.',
  );
  assert.ok(msg.startsWith('Halo Hanna Filia'));
  assert.ok(msg.includes('Nama: Budi'));
  assert.ok(msg.includes('WhatsApp: 0812-7000-1234'));
  assert.ok(msg.includes('Program: English for Kids'));
  assert.ok(!msg.includes('Usia:'), 'age line must be omitted when empty');
  assert.ok(!msg.includes('Pesan:'), 'message line must be omitted when empty');
});

test('includes optional lines when they are provided', () => {
  const msg = buildEnrolmentMessage(
    { name: 'Sari', whatsapp: '081270001234', age: '9', program: 'English for Kids', message: 'Bisa hari Sabtu?' },
    'Halo',
  );
  assert.ok(msg.includes('Usia: 9'));
  assert.ok(msg.includes('Pesan: Bisa hari Sabtu?'));
});

test('builds a wa.me URL with the message percent-encoded', () => {
  const url = buildWhatsAppUrl(
    { name: 'Budi & Sari', whatsapp: '081270001234', program: 'Business English' },
    'Halo',
  );
  assert.ok(url.startsWith('https://wa.me/6281270001234?text='));
  assert.ok(url.includes('%26'), 'ampersand in the name must be encoded');
  assert.ok(!url.includes('\n'), 'raw newlines must not appear in the URL');
});
