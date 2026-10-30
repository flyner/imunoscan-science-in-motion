import { formatValidity, type Product } from "@/lib/content";

const LABELS: { key: keyof Product["technical_data"]; label: string }[] = [
  { key: "sku", label: "Código" },
  { key: "presentation", label: "Apresentação" },
  { key: "concentration", label: "Composição / concentração" },
  { key: "methodology", label: "Metodologias" },
  { key: "storage", label: "Armazenamento" },
  { key: "anvisa", label: "Registro" },
];

export function TechnicalData({ product }: { product: Product }) {
  return (
    <dl className="divide-y border-y">
      {LABELS.map(({ key, label }) => {
        const value = product.technical_data[key];
        if (!value || (Array.isArray(value) && value.length === 0)) return null;

        return (
          <div key={key} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-600">{label}</dt>
            <dd className={`text-sm leading-relaxed text-ink-950 ${key === "sku" ? "font-mono" : ""}`}>
              {Array.isArray(value) ? value.join(" · ") : value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function DocumentList({ product }: { product: Product }) {
  if (!product.documents.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {product.documents.map((doc) => {
        const validity = formatValidity(doc.valid_until);
        return (
          <li key={doc.url} className="card-lift flex flex-col rounded-xl border bg-card p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-blue-600">{doc.type}</p>
            <p className="mt-2 text-sm font-medium leading-snug text-ink-950">{doc.title}</p>
            {validity && <p className="mt-2 text-xs font-medium text-ink-800">{validity}</p>}
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-9 w-fit items-center rounded-lg border border-blue-600 px-3.5 text-xs font-semibold text-blue-700 transition-colors duration-[var(--duration-fast)] hover:bg-blue-600 hover:text-primary-foreground"
            >
              Abrir PDF<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
