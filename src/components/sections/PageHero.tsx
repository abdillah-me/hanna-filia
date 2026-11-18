import { BrandPattern } from '@/components/media/BrandPattern';

export function PageHero({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="overflow-hidden bg-primary-container text-on-primary-container">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between gap-10 px-6 py-12 md:py-14">
        <div className="min-w-0">
          <h1 className="max-w-[22ch] text-display-medium text-balance">{title}</h1>
          {lead ? <p className="mt-4 max-w-[56ch] text-body-large">{lead}</p> : null}
        </div>
        <BrandPattern pattern="block" tone="light" className="hidden h-40 w-40 flex-none md:block" />
      </div>
    </section>
  );
}
