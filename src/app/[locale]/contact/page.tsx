import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { faq } from '@/content/faq';
import { site } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Accordion } from '@/components/m3/Accordion';
import { EnrolmentForm } from '@/components/sections/EnrolmentForm';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tk = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: tk('title'),
    alternates: { canonical: `/${locale}/contact`, languages: { id: '/id/contact', en: '/en/contact' } },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tk = await getTranslations('contact');

  const rows: [string, string, string | null][] = [
    [tk('phone'), site.phone, `tel:${site.phone.replace(/\D/g, '')}`],
    [tk('whatsapp'), site.whatsapp, `https://wa.me/${site.whatsappE164}`],
    [tk('email'), site.email, `mailto:${site.email}`],
    [tk('instagram'), site.instagram, `https://instagram.com/${site.instagram.replace('@', '')}`],
  ];

  const mapQuery = encodeURIComponent('Komplek Nagoya Newton Blok C, Lubuk Baja, Batam');

  return (
    <main>
      <PageHero eyebrow={tk('eyebrow')} title={tk('title')} />

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{tk('address')}</h2>
            <address className="mb-7 not-italic text-body-large">
              {site.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>

            {rows.map(([label, value, href]) => (
              <div key={label} className="flex gap-4 border-t-[1.5px] border-outline-variant py-3.5">
                <span className="w-28 flex-none text-body-small text-on-surface-variant">{label}</span>
                {href ? (
                  <a href={href} className="font-semibold text-primary">{value}</a>
                ) : (
                  <span className="font-semibold">{value}</span>
                )}
              </div>
            ))}

            <h2 className="mb-5 mt-9 text-headline-small">{tk('hours')}</h2>
            {site.hours.map((h) => (
              <div key={h.day.en} className="flex gap-4 border-t-[1.5px] border-outline-variant py-3.5">
                <span className="w-28 flex-none text-body-small text-on-surface-variant">
                  {t(h.day, locale)}
                </span>
                <span className="font-semibold">{t(h.open, locale)}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-6 border-[1.5px] border-on-surface p-7">
              <h2 className="mb-5 text-headline-small">{tk('formTitle')}</h2>
              <EnrolmentForm />
            </div>

            <iframe
              title={tk('mapLabel')}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-video w-full border-[1.5px] border-on-surface"
            />
          </div>
        </div>
      </Section>

      <Section bordered={false}>
        <h2 className="mb-7 text-headline-large">{tk('faqTitle')}</h2>
        <div className="max-w-[800px]">
          <Accordion
            items={faq.map((item, i) => ({
              id: String(i),
              question: t(item.q, locale),
              answer: t(item.a, locale),
            }))}
          />
        </div>
      </Section>
    </main>
  );
}
