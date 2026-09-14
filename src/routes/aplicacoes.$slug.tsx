import { createFileRoute } from "@tanstack/react-router";
import { getApplication, pagePath } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { EvidenceNote, QuoteBand, SectionHeading } from "@/components/page/Blocks";
import { PageNotFound } from "@/components/page/CategoryPage";
import { CategoryCard, ProductGrid } from "@/components/products/Cards";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/motion/Reveal";
import { AppLink } from "@/components/ui/AppLink";

export const Route = createFileRoute("/aplicacoes/$slug")({
  head: ({ params }) => {
    const app = getApplication(params.slug);
    if (!app) {
      return { meta: [{ title: "Aplicação não encontrada — ImunoScan" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${app.name} — Aplicações ImunoScan`;
    const description = `Categorias, metodologias e produtos ImunoScan relacionados à aplicação ${app.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ApplicationRoute,
});

function ApplicationRoute() {
  const { slug } = Route.useParams();
  const app = getApplication(slug);

  if (!app) return <PageNotFound label="Aplicação" />;

  const tone = app.area === "diagnostico" ? "red" : "blue";

  return (
    <>
      <PageHero
        eyebrow="Aplicação"
        title={app.name}
        subtitle={
          app.area === "diagnostico"
            ? "Aplicação da rotina de imuno-hematologia e medicina transfusional."
            : "Aplicação técnica na área de pesquisa e ciências da vida."
        }
        crumbs={[
          { label: "Início", to: "/" },
          { label: "Aplicações", to: "/aplicacoes" },
          { label: app.name },
        ]}
        tone={tone}
        aside={
          app.methodologies.length > 0 ? (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                Metodologias relacionadas
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.methodologies.map((method) => (
                  <AppLink key={method} to={`/produtos?metodologia=${encodeURIComponent(method)}`}>
                    <Tag tone="blue">{method}</Tag>
                  </AppLink>
                ))}
              </div>
            </div>
          ) : undefined
        }
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeading eyebrow="Categorias" title="Onde esta aplicação aparece no catálogo" />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {app.pages.map((page, index) => (
              <CategoryCard key={page.id} page={page} index={index} tone={tone} />
            ))}
          </div>
        </div>
      </section>

      {app.products.length > 0 && (
        <section className="border-y bg-surface section-y">
          <div className="shell">
            <SectionHeading
              eyebrow="Produtos"
              title={`${app.products.length} produto(s) relacionados`}
            />
            <div className="mt-9">
              <ProductGrid products={app.products} />
            </div>
          </div>
        </section>
      )}

      <section className="border-t section-y-sm">
        <div className="shell">
          <Reveal>
            <EvidenceNote>
              Esta página é uma visão derivada das aplicações declaradas nas categorias{" "}
              {app.pages.map((page) => page.title).join(", ")}. Nenhum dado técnico foi acrescentado
              além do que consta na base editorial.
            </EvidenceNote>
          </Reveal>
          <div className="mt-6 text-sm">
            <AppLink to={pagePath(app.pages[0])} className="link-underline font-semibold text-blue-700">
              Ir para {app.pages[0].title}
            </AppLink>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
