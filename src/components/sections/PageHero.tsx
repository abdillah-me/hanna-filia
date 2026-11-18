export function PageHero({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="border-b border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-[1140px] px-6 py-12 md:py-16">
        <h1 className="max-w-[24ch] text-display-medium text-balance">{title}</h1>
        {lead ? (
          <p className="mt-4 max-w-[56ch] text-body-large text-on-surface-variant">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
