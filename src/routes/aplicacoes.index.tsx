import { createFileRoute } from "@tanstack/react-router";
import { applications } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { QuoteBand, SectionHeading } from "@/components/page/Blocks";
import { AppLink } from "@/components/ui/AppLink";
import { ArrowRight } from "@/components/ui/brand-button";
import { Reveal } from "@/components/motion/Reveal";
import { RbcMicro } from "@/components/brand/Erythrocyte";

const TITLE = "Aplicações — ImunoScan";
const DESCRIPTION =
  "Aplicações da rotina transfusional e da pesquisa em ciências da vida, com os produtos e metodologias relacionados a cada uma.";

export const Route = createFileRoute("/aplicacoes/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ApplicationsIndex,
});

function ApplicationsIndex() {
  const groups = [
    { key: "diagnostico" as const, title: "Diagnóstico & Imuno-hematologia", tone: "red" as const },
    { key: "life-sciences" as const, title: "Pesquisa & Life Sciences", tone: "blue" as const },
  ];

  return (
    <>
      <PageHero
        eyebrow="Navegação por aplicação"
        title="Aplicações"
        subtitle="Cada aplicação reúne as categorias, metodologias e produtos declarados na base técnica ImunoScan."
        crumbs={[{ label: "Início", to: "/" }, { label: "Aplicações" }]}
      />

      {groups.map((group, groupIndex) => {
        const items = applications.filter((app) => app.area === group.key);
        if (!items.length) return null;

        return (
          <section
            key={group.key}
            className={groupIndex % 2 === 1 ? "border-y bg-surface section-y" : "section-y"}
          >
            <div className="shell">
              <SectionHeading
                eyebrow={`${items.length} aplicações`}
                title={group.title}
              />
              <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((app, index) => (
                  <li key={app.slug}>
                    <Reveal delay={index * 45}>
                      <AppLink
                        to={`/aplicacoes/${app.slug}`}
                        className="card-lift group flex h-full flex-col rounded-xl border bg-card p-5"
                      >
                        <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-600">
                          <RbcMicro size={8} tone={group.tone} />
                          Aplicação
                        </span>
                        <h3 className="mt-3 text-[1.02rem] font-semibold leading-snug text-ink-950">
                          {app.name}
                        </h3>
                        <p className="mt-2 text-sm text-ink-600">
                          {app.products.length > 0
                            ? `${app.products.length} produto(s) · ${app.pages.length} categoria(s)`
                            : `${app.pages.length} categoria(s) relacionadas`}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-blue-700">
                          Ver aplicação
                          <ArrowRight />
                        </span>
                      </AppLink>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <QuoteBand />
    </>
  );
}
