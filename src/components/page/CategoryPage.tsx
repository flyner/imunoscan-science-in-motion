import type { PageContent } from "@/lib/content";
import {
  childrenOf,
  pagePath,
  pageTrail,
  productsOfPage,
  isLifeSciences,
  getPageById,
} from "@/lib/content";
import { PageHero } from "./PageHero";
import { ContentSections, EvidenceNote, QuoteBand, SectionHeading } from "./Blocks";
import { CategoryCard, ProductGrid } from "@/components/products/Cards";
import { FaqList } from "@/components/ui/Faq";
import { RbcList, Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { AppLink } from "@/components/ui/AppLink";

export function CategoryPage({ page }: { page: PageContent }) {
  const tone = isLifeSciences(page) ? "blue" : "red";
  const children = childrenOf(page.id);
  const pageProducts = productsOfPage(page);
  const trail = pageTrail(page);
  const related = (page.technical_data.related_pages ?? [])
    .map((id) => getPageById(id))
    .filter((p): p is PageContent => Boolean(p) && p!.id !== page.id);

  const crumbs = [
    { label: "Início", to: "/" },
    ...trail.slice(0, -1).map((item) => ({ label: item.title, to: pagePath(item) })),
    { label: page.title },
  ];

  return (
    <>
      <PageHero
        eyebrow={page.page_type.replace(/_/g, " ")}
        title={page.public_content.title}
        subtitle={page.public_content.subtitle}
        intro={page.public_content.introduction}
        crumbs={crumbs}
        tone={tone}
        actions={
          <>
            <ButtonLink to="/cotacao">
              {page.public_content.cta?.primary ?? "Solicitar cotação"}
              <ArrowRight />
            </ButtonLink>
            <ButtonLink to="/contato" variant="secondary">
              {page.public_content.cta?.secondary ?? "Falar com especialista"}
            </ButtonLink>
          </>
        }
        aside={
          (page.technical_data.applications?.length ?? 0) > 0 ? (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                Aplicações da categoria
              </h2>
              <div className="mt-4">
                <RbcList items={page.technical_data.applications ?? []} tone={tone} />
              </div>
              {(page.technical_data.methodologies?.length ?? 0) > 0 && (
                <div className="mt-6 border-t pt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                    Metodologias
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {page.technical_data.methodologies?.map((method) => (
                      <Tag key={method} tone="blue">
                        {method}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : undefined
        }
      />

      {(page.public_content.sections?.length ?? 0) > 0 && (
        <section className="section-y">
          <div className="shell">
            <ContentSections sections={page.public_content.sections} />
          </div>
        </section>
      )}

      {children.length > 0 && (
        <section className="border-y bg-surface section-y">
          <div className="shell">
            <SectionHeading eyebrow="Subcategorias" title="Explore dentro desta área" />
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child, index) => (
                <CategoryCard key={child.id} page={child} index={index} tone={tone} />
              ))}
            </div>
          </div>
        </section>
      )}

      {pageProducts.length > 0 && (
        <section className="section-y">
          <div className="shell">
            <SectionHeading
              eyebrow="Produtos"
              title={`${pageProducts.length} produto(s) nesta categoria`}
            />
            <div className="mt-9">
              <ProductGrid products={pageProducts} />
            </div>
          </div>
        </section>
      )}

      {(page.technical_data.product_types?.length ?? 0) > 0 && (
        <section className="border-t section-y-sm">
          <div className="shell grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14">
            <SectionHeading eyebrow="Composição da categoria" title="Tipos de insumo" />
            <Reveal delay={60} className="flex flex-wrap gap-2 self-center">
              {page.technical_data.product_types?.map((type) => (
                <Tag key={type}>{type}</Tag>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {(page.public_content.faq?.length ?? 0) > 0 && (
        <section className="border-t bg-surface section-y">
          <div className="shell max-w-3xl">
            <FaqList items={page.public_content.faq ?? []} />
          </div>
        </section>
      )}

      <section className="border-t section-y-sm">
        <div className="shell space-y-8">
          {related.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                Conteúdos relacionados
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {related.map((item) => (
                  <li key={item.id}>
                    <AppLink
                      to={pagePath(item)}
                      className="press inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-sm text-ink-800 hover:border-blue-600 hover:text-blue-700"
                    >
                      {item.title}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <EvidenceNote>
            {page.publication_scope
              ? `Escopo de publicação: ${page.publication_scope}. `
              : ""}
            Fontes desta página: {page.source_ids.join(", ")}. A disponibilidade comercial atual dos
            itens depende de confirmação junto à ImunoScan.
          </EvidenceNote>
        </div>
      </section>

      <QuoteBand
        primaryLabel={page.public_content.cta?.primary ?? "Solicitar cotação"}
        secondaryLabel={page.public_content.cta?.secondary ?? "Falar com especialista"}
      />
    </>
  );
}

export function PageNotFound({ label }: { label: string }) {
  return (
    <section className="shell section-y">
      <h1 className="text-2xl font-semibold text-ink-950">{label} não encontrada</h1>
      <p className="prose-tech mt-3 text-sm">
        O endereço solicitado não corresponde a nenhum conteúdo do catálogo.
      </p>
      <ButtonLink to="/produtos" className="mt-6">
        Ver catálogo
        <ArrowRight />
      </ButtonLink>
    </section>
  );
}
