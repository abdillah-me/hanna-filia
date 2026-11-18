'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { programs } from '@/content/programs';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { buildWhatsAppUrl, normalizeWhatsApp } from '@/lib/whatsapp';
import { Button } from '@/components/m3/Button';
import { SelectField, TextField } from '@/components/m3/TextField';

type Errors = Partial<Record<'name' | 'whatsapp' | 'program', string>>;

export function EnrolmentForm({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const tf = useTranslations('form');
  const tc = useTranslations('cta');

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [age, setAge] = useState('');
  const [program, setProgram] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null);

  const options = [
    ...programs.map((p) => ({ value: t(p.name, locale), label: t(p.name, locale) })),
    { value: 'HFOS', label: locale === 'id' ? 'Studi ke Luar Negeri (HFOS)' : 'Study Abroad (HFOS)' },
  ];

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = tf('errorNameRequired');
    if (!whatsapp.trim()) next.whatsapp = tf('errorWhatsappRequired');
    else if (normalizeWhatsApp(whatsapp) === null) next.whatsapp = tf('errorWhatsappInvalid');
    if (!program) next.program = tf('errorProgramRequired');
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    const firstInvalid = (['name', 'whatsapp', 'program'] as const).find((k) => found[k]);
    if (firstInvalid) {
      const el = event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }

    const url = buildWhatsAppUrl(
      { name, whatsapp, age: compact ? undefined : age, program, message: compact ? undefined : message },
      tf('opening'),
    );
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    setBlockedUrl(win ? null : url);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <TextField
        label={tf('name')} name="name" value={name} onChange={setName}
        error={errors.name} required
      />
      <TextField
        label={tf('whatsapp')} name="whatsapp" value={whatsapp} onChange={setWhatsapp}
        error={errors.whatsapp} placeholder={tf('whatsappPlaceholder')} type="tel" required
      />
      {compact ? null : (
        <TextField label={tf('age')} name="age" value={age} onChange={setAge} />
      )}
      <SelectField
        label={tf('program')} name="program" value={program} onChange={setProgram}
        error={errors.program} placeholder={tf('programPlaceholder')} options={options} required
      />
      {compact ? null : (
        <TextField
          label={tf('message')} name="message" value={message} onChange={setMessage} multiline
        />
      )}

      <Button type="submit">
        {tc('sendViaWhatsapp')}
      </Button>
      {blockedUrl ? (
        <a href={blockedUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
          {tf('popupBlockedFallback')}
        </a>
      ) : null}
      <p className="text-body-small text-on-surface-variant">{tf('hint')}</p>
    </form>
  );
}
