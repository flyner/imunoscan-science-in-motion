import { useEffect, useMemo, useRef, useState } from "react";
import { search } from "@/lib/content";
import { AppLink } from "@/components/ui/AppLink";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100">
      <button
        type="button"
        aria-label="Fechar busca"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/25 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Busca técnica"
        className="relative mx-auto mt-[12vh] w-[min(680px,92vw)] overflow-hidden rounded-xl border bg-white shadow-[var(--shadow-md)]"
      >
        <div className="flex items-center gap-3 border-b px-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-ink-600">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar produto, código, categoria, aplicação ou documento"
            className="h-14 w-full bg-transparent text-sm text-ink-950 outline-none placeholder:text-ink-600"
            aria-label="Termo de busca"
          />
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {query.trim().length > 0 && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-ink-600">Nenhum resultado para “{query}”.</p>
          )}
          {results.map((result) => (
            <AppLink
              key={`${result.kind}-${result.title}-${result.path}`}
              to={result.path}
              onClick={onClose}
              className="flex items-start justify-between gap-4 border-b px-4 py-3 text-left last:border-b-0 hover:bg-surface"
            >
              <span>
                <span className="block text-sm font-medium text-ink-950">{result.title}</span>
                <span className="mt-0.5 block text-xs text-ink-600">{result.trail}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-blue-600">
                  {result.kind}
                </span>
                <span className="mt-0.5 block font-mono text-[0.7rem] text-ink-600">{result.meta}</span>
              </span>
            </AppLink>
          ))}
          {!query.trim() && (
            <p className="px-4 py-6 text-sm text-ink-600">
              A busca cobre produtos, códigos SKU, categorias, aplicações e documentos técnicos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
