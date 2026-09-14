import { createFileRoute } from "@tanstack/react-router";
import {
  applications,
  diagnosticCategories,
  diagnosticHub,
  documents,
  lifeSciencesCategories,
  lifeSciencesHub,
  methodologies,
  pagePath,
  productFamilies,
  products,
  project,
  research,
} from "@/lib/content";
import { RbcField } from "@/components/brand/RbcField";
import { Agglutination } from "@/components/brand/Agglutination";
import { Erythrocyte, RbcMicro } from "@/components/brand/Erythrocyte";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, ButtonLink } from "@/components/ui/brand-button";
import { AppLink } from "@/components/ui/AppLink";
import { CategoryCard, ProductGrid } from "@/components/products/Cards";
import { QuoteBand, SectionHeading } from "@/components/page/Blocks";
import { FaqList } from "@/components/ui/Faq";

const TITLE = "ImunoScan — Precisão para diagnosticar. Ciência para avançar.";
const DESCRIPTION =
  "Reagentes de imuno-hematologia para bancos de sangue e laboratórios clínicos, e insumos técnicos para pesquisa em ciências da vida.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.slice(0, 6);
  const diagApplications = applications.filter((app) => app.area === "diagnostico");

  return (
    <>
      <Hero />
      <TwoPaths />

      {/* Linhas e produtos */}
      <section className="section-y">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Portfólio"
              title="Linhas de fabricação e distribuição"
              description={diagnosticHub.public_content.short_description}
            />
            <Reveal delay={120}>
              <ButtonLink to="/produtos" variant="secondary">
                Ver catálogo completo
                <ArrowRight />
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={60} className="mt-10 flex flex-wrap gap-2">
            {productFamilies.map((family) => (
              <span
                key={family}
                className="inline-flex items-center gap-2 rounded-full border bg-surface px-3.5 py-1.5 text-xs font-semibold tracking-wide text-ink-800"
              >
                <RbcMicro size={8} />
                {family}
                <span className="font-mono text-[0.68rem] font-normal text-ink-600">
                  {products.filter((p) => p.family === family).length}
                </span>
              </span>
            ))}
          </Reveal>

          <div className="mt-8">
            <ProductGrid products={featured} />
          </div>
        </div>
      </section>

      {/* Bloco editorial científico + aglutinação */}
      <section className="border-y bg-surface section-y">
        <div className="shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Ciência em movimento"
              title={diagnosticHub.public_content.sections?.[0]?.title ?? "Precisão imuno-hematológica"}
              description={diagnosticHub.public_content.sections?.[0]?.content}
            />
            <Reveal delay={140} className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={pagePath(diagnosticHub)}>
                Diagnóstico & Imuno-hematologia
                <ArrowRight />
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <Agglutination />
            <p className="mt-3 text-xs leading-relaxed text-ink-600">
              Representação conceitual de hemaglutinação, com finalidade educacional. Não representa
              resultado diagnóstico.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Aplicações */}
      <section className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow="Caminhos de navegação"
            title="Encontre por aplicação ou por metodologia"
            description="O mesmo produto pode ser alcançado pela categoria, pela aplicação clínica ou pela metodologia de bancada."
          />

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-600">
                Aplicações
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {diagApplications.map((app) => (
                  <li key={app.slug}>
                    <AppLink
                      to={`/aplicacoes/${app.slug}`}
                      className="press inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-sm text-ink-800 hover:border-blue-600 hover:text-blue-700"
                    >
                      {app.name}
                    </AppLink>
                  </li>
                ))}
              </ul>
              <AppLink
                to="/aplicacoes"
                className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
              >
                Ver todas as aplicações
              </AppLink>
            </Reveal>

            <Reveal delay={70}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-600">
                Metodologias
              </h3>
              <ul className="mt-4 divide-y border-y">
                {methodologies.map((method) => (
                  <li key={method}>
                    <AppLink
                      to={`/produtos?metodologia=${encodeURIComponent(method)}`}
                      className="group flex items-center justify-between gap-4 py-3.5 text-sm text-ink-800 hover:text-blue-700"
                    >
                      <span className="flex items-center gap-3">
                        <RbcMicro size={8} tone="blue" />
                        {method}
                      </span>
                      <ArrowRight />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Documentação */}
      <section className="border-t section-y-sm">
        <div className="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <SectionHeading
              eyebrow="Documentação técnica"
              title="Instruções de uso e bulas por produto"
              description="Consulte a documentação por família, categoria, código do produto ou tipo de documento."
            />
          </div>
          <Reveal delay={90} className="flex items-center gap-6">
            <p className="font-display text-[length:var(--text-title)] font-semibold leading-none text-ink-950">
              {documents.length}
              <span className="ml-2 align-middle text-xs font-medium uppercase tracking-[0.12em] text-ink-600">
                documentos
              </span>
            </p>
            <ButtonLink to="/documentacao" variant="secondary">
              Abrir documentação
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Institucional + FAQ */}
      <section className="border-t bg-surface-warm section-y">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Institucional"
              title={project.legal_entity}
              description={project.target_audience}
            />
            <Reveal delay={120} className="mt-6 space-y-2 text-sm text-ink-600">
              <p>
                Base editorial: {research.sources.length} fontes rastreadas · versão {project.version}
              </p>
              <p>{project.validation_status}</p>
            </Reveal>
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/a-imunoscan" variant="secondary">
                A ImunoScan
                <ArrowRight />
              </ButtonLink>
              <ButtonLink to="/contato" variant="ghost">
                Suporte técnico
              </ButtonLink>
            </Reveal>
          </div>
          <div>
            <FaqList
              items={[
                ...(diagnosticHub.public_content.faq ?? []),
                ...(lifeSciencesHub.public_content.faq ?? []),
              ]}
            />
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 90% at 78% 8%, oklch(0.6041 0.2028 23.11 / 0.08), transparent 68%), radial-gradient(50% 80% at 8% 90%, oklch(0.6386 0.1249 241.04 / 0.06), transparent 70%)",
        }}
      />

      <div className="shell relative grid items-center gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <Reveal as="p" className="eyebrow">
            Diagnóstico • Imuno-hematologia • Life Sciences
          </Reveal>
          <Reveal
            as="h1"
            delay={60}
            className="mt-5 text-[length:var(--text-display)] font-semibold leading-[0.97] tracking-[-0.03em] text-ink-950"
          >
            Precisão para diagnosticar.
            <br />
            <span className="text-blue-700">Ciência para avançar.</span>
          </Reveal>
          <Reveal as="p" delay={120} className="measure mt-6 text-lg leading-relaxed text-ink-800">
            {diagnosticHub.public_content.subtitle}
          </Reveal>
          <Reveal as="p" delay={160} className="measure mt-3 text-sm leading-relaxed text-ink-600">
            {lifeSciencesHub.public_content.short_description}
          </Reveal>
          <Reveal delay={210} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/produtos" size="lg">
              Explorar produtos
              <ArrowRight />
            </ButtonLink>
            <ButtonLink to="/cotacao" size="lg" variant="secondary">
              Solicitar cotação
            </ButtonLink>
          </Reveal>
        </div>

        <div className="relative h-[300px] sm:h-[380px] lg:h-[520px]">
          <RbcField />
        </div>
      </div>
    </section>
  );
}

function TwoPaths() {
  const paths = [
    {
      page: diagnosticHub,
      tone: "red" as const,
      categories: diagnosticCategories,
      label: "Rotina transfusional e laboratório clínico",
    },
    {
      page: lifeSciencesHub,
      tone: "blue" as const,
      categories: lifeSciencesCategories,
      label: "Pesquisa, bioprocesso e análise celular",
    },
  ];

  return (
    <section className="border-y bg-surface section-y-sm">
      <div className="shell grid gap-5 lg:grid-cols-2">
        {paths.map(({ page, tone, categories, label }, index) => (
          <Reveal key={page.id} delay={index * 80}>
            <AppLink
              to={pagePath(page)}
              className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-7 md:p-9"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12">
                <div className="rbc-motion" style={{ "--rbc-duration": tone === "red" ? "12s" : "14s" } as React.CSSProperties}>
                  <Erythrocyte size={190} tone={tone} tilt={tone === "red" ? -14 : 16} opacity={0.14} />
                </div>
              </div>

              <p
                className="relative text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
                style={{ color: tone === "red" ? "var(--red-600)" : "var(--blue-600)" }}
              >
                {label}
              </p>
              <h2 className="relative mt-4 max-w-md text-2xl font-semibold leading-tight text-ink-950 md:text-[1.75rem]">
                {page.title}
              </h2>
              <p className="prose-tech relative mt-4 max-w-md text-sm">
                {page.public_content.subtitle ?? page.public_content.short_description}
              </p>

              <ul className="relative mt-7 flex flex-wrap gap-x-4 gap-y-2">
                {categories.slice(0, 5).map((category) => (
                  <li key={category.id} className="flex items-center gap-2 text-xs text-ink-600">
                    <RbcMicro size={7} tone={tone} />
                    {category.title}
                  </li>
                ))}
                {categories.length > 5 && (
                  <li className="text-xs text-ink-600">+{categories.length - 5}</li>
                )}
              </ul>

              <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Entrar nesta área
                <ArrowRight />
              </span>
            </AppLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
