export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
      <div className="mx-auto max-w-[1140px] px-6 py-14 md:py-16">
        {eyebrow ? (
          <p className="mb-3.5 font-heading text-label-medium text-secondary-container">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-[24ch] text-display-medium text-balance">{title}</h1>
        {lead ? (
          <p className="mt-4 max-w-[56ch] text-body-large text-secondary-container">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
