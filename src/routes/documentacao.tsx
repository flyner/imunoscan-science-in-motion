import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { documents, formatValidity, productSlug } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { QuoteBand } from "@/components/page/Blocks";
import { AppLink } from "@/components/ui/AppLink";

const TITLE = "Documentação técnica — ImunoScan";
const DESCRIPTION =
  "Consulte instruções de uso, fichas de dados de segurança (FDS) e diagramas de hemácias dos produtos ImunoScan.";

const TABS = [
  { id: "fds", label: "FDS", type: "FDS" },
  { id: "instrucoes", label: "Instruções de uso", type: "Instrução de uso" },
  { id: "diagramas", label: "Diagramas de hemácias", type: "Diagrama de hemácias" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
  const [activeTab, setActiveTab] = useState<TabId>("fds");
  const activeType = TABS.find((tab) => tab.id === activeTab)?.type ?? "FDS";

  const results = useMemo(
    () => documents.filter((doc) => doc.type === activeType),
    [activeType],
  );

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
          <div
            role="tablist"
            aria-label="Tipos de documento"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {TABS.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-11 shrink-0 whitespace-nowrap rounded-lg border px-4 text-sm font-semibold transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "bg-card text-ink-800 hover:border-blue-600 hover:text-blue-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-ink-600" role="status">
            {results.length} documentos
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
              <p className="mt-1 text-xs text-ink-600">PDF com aproximadamente 52 MB</p>
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
