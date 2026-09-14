import type { ReactNode } from "react";

const control =
  "mt-2 w-full rounded-lg border bg-card px-3.5 text-sm text-ink-950 outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-ink-600 focus:border-blue-600";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: (props: { className: string; id: string }) => ReactNode;
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.1em] text-ink-600">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {children({ className: control, id })}
      {hint && <p className="mt-1.5 text-xs text-ink-600">{hint}</p>}
    </div>
  );
}

export function TextField(props: {
  label: string;
  type?: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={props.label} required={props.required} hint={props.hint}>
      {({ className, id }) => (
        <input
          id={id}
          type={props.type ?? "text"}
          required={props.required}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          className={`${className} h-11`}
        />
      )}
    </Field>
  );
}

export function TextArea(props: {
  label: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={props.label} required={props.required} hint={props.hint}>
      {({ className, id }) => (
        <textarea
          id={id}
          required={props.required}
          rows={props.rows ?? 5}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          className={`${className} py-3 leading-relaxed`}
        />
      )}
    </Field>
  );
}
