import { createFileRoute } from "@tanstack/react-router";
import {
  diagnosticHub,
  lifeSciencesHub,
  pages,
  products,
  project,
} from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { QuoteBand, SectionHeading } from "@/components/page/Blocks";
import { Reveal } from "@/components/motion/Reveal";
import { RbcList } from "@/components/ui/Tag";
import { Agglutination } from "@/components/brand/Agglutination";

const TITLE = "A ImunoScan — Scan Diagnóstica Ltda";
const DESCRIPTION =
  "Scan Diagnóstica Ltda: reagentes de imuno-hematologia com registro no Ministério da Saúde e insumos técnicos para pesquisa em ciências da vida.";

export const Route = createFileRoute("/a-imunoscan")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: project.name,
          legalName: project.legal_entity,
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: About,
});

function About() {
  const figures = [
    { value: String(products.length), label: "produtos registrados na base técnica" },
    { value: String(pages.length), label: "áreas e categorias documentadas" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title={project.legal_entity}
        subtitle={DESCRIPTION}
        intro={project.target_audience}
        crumbs={[{ label: "Início", to: "/" }, { label: "A ImunoScan" }]}
      />

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Duas frentes técnicas"
              title="Diagnóstico transfusional e ciências da vida"
            />
            <div className="prose-tech measure mt-6 space-y-4 text-sm">
              <p>{diagnosticHub.public_content.introduction}</p>
              <p>{lifeSciencesHub.public_content.introduction}</p>
            </div>
          </div>
          <Reveal delay={80}>
            <Agglutination />
          </Reveal>
        </div>
      </section>

      <section className="border-y bg-surface section-y-sm">
        <div className="shell grid gap-8 sm:grid-cols-2">
          {figures.map((figure, index) => (
            <Reveal key={figure.label} delay={index * 60}>
              <p className="font-display text-[length:var(--text-title)] font-semibold leading-none text-ink-950">
                {figure.value}
              </p>
              <p className="mt-3 max-w-[18rem] text-sm text-ink-600">{figure.label}</p>
            </Reveal>
          ))}
        </div>
      </section>


      <section className="border-t bg-surface-warm section-y-sm">
        <div className="shell">
          <div>
            <SectionHeading eyebrow="Público atendido" title="Para quem trabalhamos" />
            <div className="mt-6">
              <RbcList
                items={project.target_audience
                  .replace(/^B2B\s*-\s*/, "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)}
              />
            </div>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
