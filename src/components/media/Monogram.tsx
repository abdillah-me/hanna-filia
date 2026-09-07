export function Monogram({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-primary-container ${className}`}
    >
      <span className="font-heading text-display-small text-on-primary-container">
        {initials}
      </span>
    </div>
  );
}
