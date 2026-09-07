export function Marquee({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-[1.5px] border-on-surface bg-primary py-3.5"
    >
      <div className="flex w-max animate-[hf-marquee_38s_linear_infinite]">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="whitespace-nowrap font-heading text-title-large text-secondary-container"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
