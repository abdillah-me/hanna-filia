import { useTranslations } from 'next-intl';
import { Badge } from '@/components/m3/Badge';
import { EnrolmentForm } from '@/components/sections/EnrolmentForm';

export function TrialCta() {
  const th = useTranslations('home');

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-[1140px] items-start gap-10 px-6 py-18 md:grid-cols-2 md:gap-16">
        <div>
          <Badge>{th('trialBadge')}</Badge>
          <h2 className="mb-4 mt-4 text-display-small">{th('trialTitle')}</h2>
          <p className="max-w-[52ch] text-body-large">{th('trialBody')}</p>
        </div>
        <div className="border-[1.5px] border-on-surface p-7">
          <EnrolmentForm compact />
        </div>
      </div>
    </section>
  );
}
