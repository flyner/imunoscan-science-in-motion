import {
  type PageContent,
  type Product,
  pagePath,
  primaryPageOfProduct,
  productSlug,
} from "@/lib/content";
import { AppLink } from "@/components/ui/AppLink";
import { ArrowRight } from "@/components/ui/Button";
import { Erythrocyte } from "@/components/brand/Erythrocyte";
import { Reveal } from "@/components/motion/Reveal";

export function CategoryCard({
  page,
  index = 0,
  tone = "red",
}: {
  page: PageContent;
  index?: number;
  tone?: "red" | "blue";
}) {
  return (
    <Reveal delay={index * 55}>
      <AppLink
        to={pagePath(page)}
        className="card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card p-6"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-8">
          <Erythrocyte size={92} tone={tone} tilt={-16} opacity={0.12} />
        </div>
        <p className="eyebrow relative text-[0.68rem]" style={tone === "red" ? { color: "var(--red-600)" } : undefined}>
          {page.page_type.replace(/_/g, " ")}
        </p>
        <h3 className="relative mt-3 text-lg font-semibold leading-snug text-ink-950">{page.title}</h3>
        <p className="relative mt-3 line-clamp-4 text-sm leading-relaxed text-ink-600">
          {page.public_content.short_description ?? page.public_content.subtitle}
        </p>
        <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
          Ver categoria
          <ArrowRight />
        </span>
      </AppLink>
    </Reveal>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const page = primaryPageOfProduct(product);

  return (
    <Reveal delay={index * 50}>
      <AppLink
        to={`/produto/${productSlug(product)}`}
        className="card-lift group flex h-full flex-col rounded-xl border bg-card p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-red-600">
            {product.family}
          </span>
          {product.technical_data.sku && (
            <span className="font-mono text-[0.7rem] text-ink-600">{product.technical_data.sku}</span>
          )}
        </div>
        <h3 className="mt-3 text-[1.02rem] font-semibold leading-snug text-ink-950">{product.name}</h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-600">
          {product.public_content.short_description}
        </p>
        <div className="mt-auto pt-5">
          {page && <p className="text-xs text-ink-600">{page.title}</p>}
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
            Ficha técnica
            <ArrowRight />
          </span>
        </div>
      </AppLink>
    </Reveal>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
