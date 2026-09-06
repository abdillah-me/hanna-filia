'use client';

import { useId } from 'react';

type Base = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

const FIELD =
  'w-full border-[1.5px] rounded-sm bg-surface px-3.5 py-3 min-h-12 ' +
  'font-body text-body-large text-on-surface ' +
  'transition-colors duration-200 ease-standard';

export function TextField({
  label, name, value, onChange, error, required, placeholder,
  type = 'text', multiline = false,
}: Base & { type?: string; multiline?: boolean }) {
  const id = useId();
  const errorId = `${id}-error`;
  const border = error ? 'border-error' : 'border-on-surface focus-visible:border-primary';
  const shared = {
    id,
    name,
    value,
    required,
    placeholder,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `${FIELD} ${border}`,
  };

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-body-small font-semibold text-on-surface">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={3}
          className={`${shared.className} resize-y`}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <p id={errorId} className="text-body-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label, name, value, onChange, error, required, placeholder, options,
}: Base & { options: { value: string; label: string }[] }) {
  const id = useId();
  const errorId = `${id}-error`;
  const border = error ? 'border-error' : 'border-on-surface focus-visible:border-primary';

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-body-small font-semibold text-on-surface">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} ${border}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-body-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
