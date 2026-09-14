import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { documentTypes, documents, productFamilies, productSlug } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { EvidenceNote, QuoteBand } from "@/components/page/Blocks";
import { AppLink } from "@/components/ui/AppLink";

const TITLE = "Documentação técnica — ImunoScan";
const DESCRIPTION =
  "Busque instruções de uso e bulas técnicas ImunoScan por produto, código, família ou tipo de documento.";

export const Route = createFileRoute("/documentacao")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Documentation,
});

function Documentation() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [type, setType] = useState("");

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return documents.filter((doc) => {
      if (family && doc.family !== family) return false;
      if (type && doc.type !== type) return false;
      if (!terms.length) return true;
      const haystack = [doc.title, doc.filename, doc.product.name, doc.sku, doc.category]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [query, family, type]);

  return (
    <>
      <PageHero
        eyebrow="Ferramenta técnica"
        title="Documentação técnica"
        subtitle={DESCRIPTION}
        crumbs={[{ label: "Início", to: "/" }, { label: "Documentação" }]}
        tone="blue"
      />

      <section className="section-y-sm">
        <div className="shell">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
            <label className="block">
              <span className="sr-only">Buscar documento</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por produto, código ou documento"
                className="h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-ink-950 outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-ink-600 focus:border-blue-600"
              />
            </label>
            <label className="block">
              <span className="sr-only">Família</span>
              <select
                value={family}
                onChange={(event) => setFamily(event.target.value)}
                className="h-11 w-full rounded-lg border bg-card px-3 text-sm text-ink-950 outline-none focus:border-blue-600"
              >
                <option value="">Todas as famílias</option>
                {productFamilies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Tipo de documento</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="h-11 w-full rounded-lg border bg-card px-3 text-sm text-ink-950 outline-none focus:border-blue-600"
              >
                <option value="">Todos os tipos</option>
                {documentTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-4 text-xs text-ink-600" role="status">
            {results.length} de {documents.length} documentos
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-surface text-[0.7rem] uppercase tracking-[0.1em] text-ink-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Documento</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Produto</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Código</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tipo</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Arquivo</th>
                </tr>
              </thead>
              <tbody>
                {results.map((doc) => (
                  <tr key={doc.id} className="border-t align-top">
                    <td className="px-4 py-3 text-ink-950">{doc.title}</td>
                    <td className="px-4 py-3">
                      <AppLink
                        to={`/produto/${productSlug(doc.product)}`}
                        className="link-underline text-blue-700"
                      >
                        {doc.product.name}
                      </AppLink>
                      <span className="mt-1 block text-xs text-ink-600">{doc.category}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-800">{doc.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-800">{doc.type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{doc.filename}</td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr className="border-t">
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-600">
                      Nenhum documento corresponde aos filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <EvidenceNote>
              Os arquivos listados correspondem às instruções de uso na versão 01/2016 e são
              disponibilizados pela assessoria técnica sob solicitação. Certificados de análise e
              FISPQ serão incorporados quando enviados pela ImunoScan.
            </EvidenceNote>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
