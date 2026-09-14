import { createFileRoute } from "@tanstack/react-router";
import {
  getProduct,
  pagePath,
  pageTrail,
  primaryPageOfProduct,
  productSlug,
  project,
  relatedProducts,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight, ButtonLink } from "@/components/ui/brand-button";
import { EvidenceNote, QuoteBand, SectionHeading } from "@/components/page/Blocks";
import { PageNotFound } from "@/components/page/CategoryPage";
import { DocumentList, TechnicalData } from "@/components/products/TechnicalData";
import { ProductGrid } from "@/components/products/Cards";
import { RbcList, Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/motion/Reveal";
import { Erythrocyte } from "@/components/brand/Erythrocyte";

export const Route = createFileRoute("/produto/$slug")({
  head: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) {
      return { meta: [{ title: "Produto não encontrado — ImunoScan" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${product.name} — ImunoScan`;
    const description = product.public_content.short_description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.public_content.short_description,
            sku: product.technical_data.sku,
            category: product.category,
            brand: { "@type": "Brand", name: product.family },
            manufacturer: { "@type": "Organization", name: project.legal_entity },
          }),
        },
      ],
    };
  },
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);

  if (!product) return <PageNotFound label="Ficha de produto" />;

  const page = primaryPageOfProduct(product);
  const trail = page ? pageTrail(page) : [];
  const related = relatedProducts(product);

  return (
    <>
      <section className="relative overflow-hidden border-b bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(70% 110% at 92% 0%, oklch(0.6041 0.2028 23.11 / 0.06), transparent 70%)",
          }}
        />
        <div className="shell relative py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Início", to: "/" },
              { label: "Produtos", to: "/produtos" },
              ...trail.map((item) => ({ label: item.title, to: pagePath(item) })),
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Reveal as="p" className="eyebrow" >
                {product.family}
              </Reveal>
              <Reveal
                as="h1"
                delay={50}
                className="mt-3 max-w-2xl text-[length:var(--text-title)] font-semibold leading-[1.1] text-ink-950"
              >
                {product.name}
              </Reveal>
              <Reveal as="p" delay={100} className="measure mt-5 text-lg leading-relaxed text-ink-800">
                {product.public_content.short_description}
              </Reveal>

              <Reveal delay={150} className="mt-7">
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                  Aplicações
                </h2>
                <div className="mt-3">
                  <RbcList items={product.public_content.applications} />
                </div>
              </Reveal>

              <Reveal delay={200} className="mt-9 flex flex-wrap gap-3">
                <ButtonLink to="/cotacao" size="lg">
                  Solicitar cotação deste item
                  <ArrowRight />
                </ButtonLink>
                <ButtonLink to="/contato" size="lg" variant="secondary">
                  Consultar assessoria técnica
                </ButtonLink>
              </Reveal>
            </div>

            {/* Composição editorial abstrata — não há foto oficial de embalagem no pacote. */}
            <Reveal delay={120}>
              <figure className="relative overflow-hidden rounded-2xl border bg-card p-8">
                <div className="relative grid h-52 place-items-center">
                  <div
                    className="rbc-motion"
                    style={{ "--rbc-duration": "12s" } as React.CSSProperties}
                  >
                    <Erythrocyte size={176} tilt={-10} flatten={0.84} />
                  </div>
                  <div className="rbc-motion-alt absolute right-2 top-2" style={{ "--rbc-duration": "14s" } as React.CSSProperties}>
                    <Erythrocyte size={64} tilt={22} flatten={0.6} opacity={0.7} />
                  </div>
                  <div className="rbc-motion absolute bottom-1 left-3" style={{ "--rbc-duration": "13s", "--rbc-delay": "-4s" } as React.CSSProperties}>
                    <Erythrocyte size={44} tilt={-24} flatten={0.55} opacity={0.55} />
                  </div>
                </div>
                <figcaption className="mt-6 border-t pt-4 text-xs leading-relaxed text-ink-600">
                  Composição editorial ImunoScan. Imagem oficial de embalagem pendente de envio pela
                  empresa.
                </figcaption>
              </figure>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.technical_data.sku && <Tag>Código {product.technical_data.sku}</Tag>}
                {product.technical_data.methodology?.slice(0, 2).map((method) => (
                  <Tag key={method} tone="blue">
                    {method}
                  </Tag>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Descrição técnica" title="Sobre o reagente" />
            <p className="prose-tech measure mt-6 text-sm">{product.public_content.description}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
              Dados técnicos
            </h2>
            <div className="mt-4">
              <TechnicalData product={product} />
            </div>
          </div>
        </div>
      </section>

      {product.documents.length > 0 && (
        <section className="border-y bg-surface section-y-sm">
          <div className="shell">
            <SectionHeading eyebrow="Documentação" title="Instruções de uso e bulas" />
            <div className="mt-8">
              <DocumentList product={product} />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-y">
          <div className="shell">
            <SectionHeading eyebrow="Relacionados" title="Produtos da mesma linha ou categoria" />
            <div className="mt-8">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}

      <section className="border-t section-y-sm">
        <div className="shell">
          <EvidenceNote>
            Evidência: {product.evidence_status}. Situação comercial atual:{" "}
            {product.current_commercial_status}. Fontes: {product.source_ids.join(", ")}. Registro
            declarado na documentação histórica: {product.technical_data.anvisa ?? "não informado"}.
          </EvidenceNote>
        </div>
      </section>

      <QuoteBand
        title={`Cotação — ${product.name}`}
        description={`Informe a apresentação desejada (${product.technical_data.presentation ?? "conforme disponibilidade"}) e o volume estimado.`}
      />
    </>
  );
}

export const _slugHelper = productSlug;
