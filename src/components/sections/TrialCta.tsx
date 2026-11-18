import { useTranslations } from 'next-intl';
import { EnrolmentForm } from '@/components/sections/EnrolmentForm';

export function TrialCta() {
  const th = useTranslations('home');

  return (
    <section className="bg-surface-container-low">
      <div className="mx-auto grid max-w-[1140px] items-start gap-10 px-6 py-18 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="mb-4 text-display-small">{th('trialTitle')}</h2>
          <p className="max-w-[52ch] text-body-large">{th('trialBody')}</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-7 elevation-1">
          <EnrolmentForm compact />
        </div>
      </div>
    </section>
  );
}
