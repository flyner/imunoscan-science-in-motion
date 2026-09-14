import type { ReactNode } from "react";
import type { Section } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink, ArrowRight } from "@/components/ui/brand-button";
import { Erythrocyte } from "@/components/brand/Erythrocyte";

/** Título de seção com sobrescrito editorial. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  align?: "left" | "center";
}) {
  return (
    <header className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h2" delay={40} className="mt-3 text-2xl font-semibold leading-tight text-ink-950 md:text-[2rem]">
        {title}
      </Reveal>
      {description && (
        <Reveal as="p" delay={90} className="prose-tech mt-4 text-sm">
          {description}
        </Reveal>
      )}
    </header>
  );
}

/** Renderiza as seções editoriais vindas do JSON. */
export function ContentSections({ sections }: { sections?: Section[] | undefined }) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-12">
      {sections.map((section, index) =>
        section.format === "cards" ? (
          <Reveal key={section.id} delay={index * 60}>
            <article className="relative overflow-hidden rounded-xl border bg-surface p-6 md:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10">
                <Erythrocyte size={120} tilt={-14} opacity={0.1} />
              </div>
              <h3 className="relative text-lg font-semibold text-ink-950">{section.title}</h3>
              <p className="prose-tech measure relative mt-3 text-sm">{section.content}</p>
            </article>
          </Reveal>
        ) : (
          <Reveal key={section.id} delay={index * 60}>
            <article className="grid gap-4 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10">
              <h3 className="text-lg font-semibold leading-snug text-ink-950">{section.title}</h3>
              <p className="prose-tech measure text-sm">{section.content}</p>
            </article>
          </Reveal>
        ),
      )}
    </div>
  );
}

/** Faixa de cotação — CTA permanente, sem agressividade. */
export function QuoteBand({
  title = "Solicite cotação técnica",
  description = "Envie a relação de reagentes, metodologia utilizada e volume estimado. O retorno é feito pela assessoria técnica.",
  primaryLabel = "Solicitar cotação",
  secondaryLabel = "Falar com a assessoria técnica",
}: {
  title?: string;
  description?: string | undefined;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[8%] hidden md:block"
      >
        <div className="rbc-motion" style={{ "--rbc-duration": "13s" } as React.CSSProperties}>
          <Erythrocyte size={260} tilt={12} variant={1} opacity={0.16} />
        </div>
      </div>

      <div className="shell relative section-y-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="h2" className="max-w-xl text-2xl font-semibold leading-tight text-white md:text-[2rem]">
              {title}
            </Reveal>
            <Reveal as="p" delay={60} className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              {description}
            </Reveal>
          </div>
          <Reveal delay={110} className="flex flex-wrap gap-3">
            <ButtonLink to="/cotacao" size="lg">
              {primaryLabel}
              <ArrowRight />
            </ButtonLink>
            <ButtonLink
              to="/contato"
              size="lg"
              variant="secondary"
              className="border-white/25 bg-transparent text-white hover:border-white/60"
            >
              {secondaryLabel}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Transparência editorial: status de evidência declarado no próprio JSON. */
export function EvidenceNote({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-lg border border-blue-600/20 bg-blue-600/5 p-4 text-xs leading-relaxed text-ink-800">
      {children}
    </aside>
  );
}
