import type { Product } from "@/lib/content";

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
      {product.documents.map((doc) => (
        <li key={doc.filename} className="card-lift rounded-xl border bg-card p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-blue-600">{doc.type}</p>
          <p className="mt-2 text-sm font-medium leading-snug text-ink-950">{doc.title}</p>
          <p className="mt-2 font-mono text-[0.7rem] text-ink-600">{doc.filename}</p>
          <p className="mt-3 text-xs text-ink-600">
            Arquivo disponível sob solicitação à assessoria técnica.
          </p>
        </li>
      ))}
    </ul>
  );
}
