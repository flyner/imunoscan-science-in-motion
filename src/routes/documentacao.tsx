import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { documentTypes, documents, formatValidity, productFamilies, productSlug, products } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { EvidenceNote, QuoteBand } from "@/components/page/Blocks";
import { AppLink } from "@/components/ui/AppLink";

const TITLE = "Documentação técnica — ImunoScan";
const DESCRIPTION =
  "Instruções de uso, fichas de dados de segurança (FDS) e diagramas de hemácias ImunoScan, com filtros por produto, tipo e linha.";

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
  const [productId, setProductId] = useState("");

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return documents.filter((doc) => {
      if (family && doc.family !== family) return false;
      if (type && doc.type !== type) return false;
      if (productId && doc.product.id !== productId) return false;
      if (!terms.length) return true;
      const haystack = [doc.title, doc.filename, doc.product.name, doc.sku, doc.category]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [query, family, type, productId]);

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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
              <span className="sr-only">Produto</span>
              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                className="h-11 w-full rounded-lg border bg-card px-3 text-sm text-ink-950 outline-none focus:border-blue-600"
              >
                <option value="">Todos os produtos</option>
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Família</span>
              <select
                value={family}
                onChange={(event) => setFamily(event.target.value)}
                className="h-11 w-full rounded-lg border bg-card px-3 text-sm text-ink-950 outline-none focus:border-blue-600"
              >
                <option value="">Todas as linhas</option>
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
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-surface text-[0.7rem] uppercase tracking-[0.1em] text-ink-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Documento</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Produto</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Código</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tipo</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Validade</th>
                  <th scope="col" className="px-4 py-3 font-semibold"><span className="sr-only">Ação</span></th>
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
                    <td className="px-4 py-3 text-xs text-ink-800">{formatValidity(doc.valid_until) ?? "—"}</td>
                    <td className="px-4 py-3">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center whitespace-nowrap rounded-lg border border-blue-600 px-3 text-xs font-semibold text-blue-700 transition-colors duration-[var(--duration-fast)] hover:bg-blue-600 hover:text-white"
                      >
                        Abrir PDF<span className="sr-only"> (abre em nova aba)</span>
                      </a>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr className="border-t">
                    <td colSpan={6} className="px-4 py-8 text-center text-ink-600">
                      Nenhum documento corresponde aos filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-xl border bg-surface p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-blue-600">
                Material educacional
              </p>
              <h2 className="mt-2 text-lg font-semibold text-ink-950">
                Apostila de Imuno-hematologia Básica
              </h2>
              <p className="mt-1 text-xs text-ink-600">PDF · arquivo grande, aproximadamente 52 MB</p>
            </div>
            <a
              href="/documentos/apostila/Imunohematologia%20Basica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 shrink-0 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors duration-[var(--duration-fast)] hover:bg-blue-700 md:mt-0"
            >
              Abrir apostila<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
