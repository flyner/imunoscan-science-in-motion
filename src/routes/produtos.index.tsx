import { createFileRoute } from "@tanstack/react-router";
import {
  diagnosticCategories,
  diagnosticHub,
  lifeSciencesCategories,
  lifeSciencesHub,
  methodologies,
  pagePath,
  productFamilies,
  products,
  productsByMethodology,
} from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { QuoteBand, SectionHeading } from "@/components/page/Blocks";
import { CategoryCard, ProductGrid } from "@/components/products/Cards";
import { ArrowRight, ButtonLink } from "@/components/ui/brand-button";
import { AppLink } from "@/components/ui/AppLink";
import { Reveal } from "@/components/motion/Reveal";
import { RbcMicro } from "@/components/brand/Erythrocyte";
import { catalogCover } from "@/data/catalog-media";

const TITLE = "Produtos — ImunoScan";
const DESCRIPTION =
  "Catálogo ImunoScan: reagentes de imuno-hematologia, hemácias-teste, antiglobulina humana, potencializadores, controles e insumos para pesquisa.";

export const Route = createFileRoute("/produtos/")({
  validateSearch: (search: Record<string, unknown>): { metodologia?: string } =>
    typeof search["metodologia"] === "string" ? { metodologia: search["metodologia"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const { metodologia } = Route.useSearch();
  const filtered = metodologia ? productsByMethodology(metodologia) : products;

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title="Produtos ImunoScan"
        subtitle={diagnosticHub.public_content.short_description}
        crumbs={[{ label: "Início", to: "/" }, { label: "Produtos" }]}
        aside={
          <figure className="bg-card p-4 md:p-6">
            <div className="aspect-[4/3] w-full">
              <img
                src={catalogCover.src}
                alt={catalogCover.alt}
                fetchPriority="high"
                className="h-full w-full object-contain"
              />
            </div>
          </figure>
        }
        actions={
          <>
            <ButtonLink to={pagePath(diagnosticHub)}>
              Diagnóstico & Imuno-hematologia
              <ArrowRight />
            </ButtonLink>
            <ButtonLink to="/life-sciences" variant="secondary">
              Pesquisa & Life Sciences
            </ButtonLink>
          </>
        }
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow="Diagnóstico & Imuno-hematologia"
            title="Categorias da rotina transfusional"
            description={diagnosticHub.public_content.introduction}
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosticCategories.map((page, index) => (
              <CategoryCard key={page.id} page={page} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-surface section-y">
        <div className="shell">
          <SectionHeading
            eyebrow="Pesquisa & Life Sciences"
            title="Categorias técnicas de pesquisa"
            description={lifeSciencesHub.public_content.short_description}
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lifeSciencesCategories.map((page, index) => (
              <CategoryCard key={page.id} page={page} index={index} tone="blue" />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Por metodologia"
              title={
                metodologia
                  ? `Produtos com metodologia: ${metodologia}`
                  : "Todos os produtos registrados"
              }
              description={`${filtered.length} de ${products.length} produtos · famílias ${productFamilies.join(", ")}`}
            />
          </div>

          <Reveal delay={60} className="mt-8 flex flex-wrap gap-2">
            <AppLink
              to="/produtos"
              className={`press inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm ${
                metodologia ? "bg-card text-ink-800 hover:border-blue-600" : "border-blue-600 bg-blue-600/8 text-blue-700"
              }`}
            >
              Todas
            </AppLink>
            {methodologies.map((method) => (
              <AppLink
                key={method}
                to={`/produtos?metodologia=${encodeURIComponent(method)}`}
                className={`press inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm ${
                  metodologia === method
                    ? "border-blue-600 bg-blue-600/8 text-blue-700"
                    : "bg-card text-ink-800 hover:border-blue-600 hover:text-blue-700"
                }`}
              >
                <RbcMicro size={7} tone="blue" />
                {method}
              </AppLink>
            ))}
          </Reveal>

          <div className="mt-9">
            <ProductGrid products={filtered} />
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
