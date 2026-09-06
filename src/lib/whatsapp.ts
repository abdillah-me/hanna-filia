import { site } from '../content/site.ts';

/**
 * Normalises an Indonesian mobile number to E.164 without the leading `+`.
 * Accepts the forms people actually type: 0812…, +62 812…, 62812…, 812…,
 * with spaces, dashes, dots or parentheses anywhere. Returns null when the
 * result could not be a valid Indonesian mobile number.
 */
export function normalizeWhatsApp(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 0) return null;

  // International prefix dialled the old way: 0062… → 62…
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('62')) {
    // already country-coded
  } else if (digits.startsWith('0')) {
    digits = `62${digits.slice(1)}`;
  } else if (digits.startsWith('8')) {
    digits = `62${digits}`;
  } else {
    return null;
  }

  return /^62\d{9,13}$/.test(digits) ? digits : null;
}

export type EnrolmentDetails = {
  name: string;
  whatsapp: string;
  age?: string;
  program: string;
  message?: string;
};

/**
 * Builds the WhatsApp body. `opening` comes from the active locale's
 * `form.opening` translation so the message matches the language the visitor
 * was reading. Field labels stay Indonesian: the recipient is the Batam office.
 */
export function buildEnrolmentMessage(details: EnrolmentDetails, opening: string): string {
  const lines = [
    `Nama: ${details.name.trim()}`,
    `WhatsApp: ${details.whatsapp.trim()}`,
    details.age?.trim() ? `Usia: ${details.age.trim()}` : null,
    `Program: ${details.program.trim()}`,
    details.message?.trim() ? `Pesan: ${details.message.trim()}` : null,
  ].filter((line): line is string => line !== null);

  return `${opening}\n\n${lines.join('\n')}`;
}

export function buildWhatsAppUrl(details: EnrolmentDetails, opening: string): string {
  const text = encodeURIComponent(buildEnrolmentMessage(details, opening));
  return `https://wa.me/${site.whatsappE164}?text=${text}`;
}
