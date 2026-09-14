import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { RbcAccent } from "@/components/brand/RbcField";
import { Reveal } from "@/components/motion/Reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  intro,
  crumbs,
  tone = "red",
  actions,
  aside,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  crumbs?: Crumb[];
  tone?: "red" | "blue";
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            tone === "red"
              ? "radial-gradient(75% 120% at 88% -10%, oklch(0.6041 0.2028 23.11 / 0.07), transparent 70%)"
              : "radial-gradient(75% 120% at 88% -10%, oklch(0.6386 0.1249 241.04 / 0.08), transparent 70%)",
        }}
      />
      <RbcAccent className="-right-10 top-10 hidden md:block" size={200} tone={tone} opacity={0.14} />

      <div className="shell relative py-14 md:py-20">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={`mt-6 grid gap-10 ${aside ? "lg:grid-cols-[1.15fr_0.85fr] lg:items-center" : ""}`}>
          <div>
            {eyebrow && (
              <Reveal as="p" className="eyebrow">
                {eyebrow}
              </Reveal>
            )}
            <Reveal as="h1" delay={40} className="mt-3 max-w-3xl text-[length:var(--text-title)] font-semibold leading-[1.08] text-ink-950">
              {title}
            </Reveal>
            {subtitle && (
              <Reveal as="p" delay={90} className="measure mt-5 text-lg leading-relaxed text-ink-800">
                {subtitle}
              </Reveal>
            )}
            {intro && (
              <Reveal as="p" delay={140} className="measure prose-tech mt-5 text-sm">
                {intro}
              </Reveal>
            )}
            {actions && (
              <Reveal delay={180} className="mt-8 flex flex-wrap gap-3">
                {actions}
              </Reveal>
            )}
          </div>
          {aside && <Reveal delay={120}>{aside}</Reveal>}
        </div>
      </div>
    </section>
  );
}
