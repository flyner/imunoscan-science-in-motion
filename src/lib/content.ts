import raw from "@/data/content.json";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type Section = {
  id: string;
  title: string;
  content: string;
  format?: string;
};

export type Faq = { question: string; answer: string };

export type PageContent = {
  id: string;
  parent_id: string | null;
  title: string;
  slug: string;
  page_type: string;
  publication_scope?: string;
  public_content: {
    title: string;
    subtitle?: string;
    short_description?: string;
    introduction?: string;
    sections?: Section[];
    faq?: Faq[];
    cta?: { primary?: string; secondary?: string };
  };
  technical_data: {
    applications?: string[];
    methodologies?: string[];
    product_types?: string[];
    related_pages?: string[];
  };
  products: string[];
  source_ids: string[];
};

export type ProductDoc = { title: string; type: string; filename: string };

export type Product = {
  id: string;
  name: string;
  family: string;
  category: string;
  public_content: {
    short_description: string;
    description: string;
    applications: string[];
  };
  technical_data: {
    sku?: string;
    presentation?: string;
    concentration?: string;
    methodology?: string[];
    storage?: string;
    anvisa?: string;
  };
  documents: ProductDoc[];
  confidence: string;
  source_ids: string[];
  evidence_status?: string;
  current_commercial_status?: string;
};

export type Source = {
  source_id: string;
  organization: string;
  title: string;
  url: string;
  source_type: string;
  supports: string[];
};

type Db = {
  project: {
    name: string;
    legal_entity: string;
    language: string;
    version: string;
    target_audience: string;
    validation_status: string;
    validation_note: string;
  };
  research: {
    methodology: string;
    benchmarks: { id: string; name: string; segment: string; country: string }[];
    sources: Source[];
  };
  pages: PageContent[];
  products: Product[];
  pending_imunoscan: { question: string; reason: string; priority: string }[];
  quality_report: Record<string, unknown>;
};

const db = raw as unknown as Db;

export const project = db.project;
export const research = db.research;
export const pages = db.pages;
export const products = db.products;
export const pendingQuestions = db.pending_imunoscan;

/* ------------------------------------------------------------------ */
/* Slugs e acessos                                                     */
/* ------------------------------------------------------------------ */

export const DIAGNOSTIC_HUB = "diagnostico-imuno-hematologia";
export const LIFE_SCIENCES_HUB = "pesquisa-life-sciences";

const HUB_IDS = {
  diagnostico: "PAGE-HUB-DIAGNOSTICO",
  lifeSciences: "PAGE-HUB-LIFESCIENCES",
} as const;

export function productSlug(product: Product): string {
  return product.id.replace(/^PROD-/, "").toLowerCase().replace(/_/g, "-");
}

const productBySlug = new Map(products.map((p) => [productSlug(p), p]));
const productById = new Map(products.map((p) => [p.id, p]));
const pageById = new Map(pages.map((p) => [p.id, p]));
const pageBySlug = new Map(pages.map((p) => [p.slug, p]));

export const getProduct = (slug: string) => productBySlug.get(slug);
export const getProductById = (id: string) => productById.get(id);
export const getPage = (slug: string) => pageBySlug.get(slug);
export const getPageById = (id: string) => pageById.get(id);

export const diagnosticHub = pageById.get(HUB_IDS.diagnostico)!;
export const lifeSciencesHub = pageById.get(HUB_IDS.lifeSciences)!;

function rootOf(page: PageContent): PageContent {
  let current = page;
  while (current.parent_id) {
    const parent = pageById.get(current.parent_id);
    if (!parent) break;
    current = parent;
  }
  return current;
}

export const isLifeSciences = (page: PageContent) =>
  rootOf(page).id === HUB_IDS.lifeSciences;

export const childrenOf = (id: string) => pages.filter((p) => p.parent_id === id);

export const diagnosticCategories = childrenOf(HUB_IDS.diagnostico);
export const lifeSciencesCategories = childrenOf(HUB_IDS.lifeSciences);

/** Caminho hierárquico da página, do hub até ela. */
export function pageTrail(page: PageContent): PageContent[] {
  const trail: PageContent[] = [page];
  let current = page;
  while (current.parent_id) {
    const parent = pageById.get(current.parent_id);
    if (!parent) break;
    trail.unshift(parent);
    current = parent;
  }
  return trail;
}

/** Rota de uma página de catálogo. */
export function pagePath(page: PageContent): string {
  if (page.id === HUB_IDS.diagnostico) return `/${DIAGNOSTIC_HUB}`;
  if (page.id === HUB_IDS.lifeSciences) return "/life-sciences";
  return isLifeSciences(page) ? `/life-sciences/${page.slug}` : `/produtos/${page.slug}`;
}

export const productsOfPage = (page: PageContent): Product[] =>
  page.products.map((id) => productById.get(id)).filter((p): p is Product => Boolean(p));

/** Todas as páginas em que o produto aparece. */
export function pagesOfProduct(product: Product): PageContent[] {
  return pages.filter((p) => p.products.includes(product.id));
}

/** Página mais específica (maior profundidade) que contém o produto. */
export function primaryPageOfProduct(product: Product): PageContent | undefined {
  const candidates = pagesOfProduct(product).filter((p) => p.page_type !== "aplicacao");
  return candidates.sort((a, b) => pageTrail(b).length - pageTrail(a).length)[0];
}

/** Relacionados: mesma categoria declarada no JSON, no máximo 3. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const sameFamily = products.filter(
    (p) => p.id !== product.id && p.family === product.family && !sameCategory.includes(p),
  );
  return [...sameCategory, ...sameFamily].slice(0, limit);
}

export const productFamilies = Array.from(new Set(products.map((p) => p.family))).sort();

export const methodologies = Array.from(
  new Set(products.flatMap((p) => p.technical_data.methodology ?? [])),
).sort();

export function productsByMethodology(method: string): Product[] {
  return products.filter((p) => (p.technical_data.methodology ?? []).includes(method));
}

/* ------------------------------------------------------------------ */
/* Aplicações (derivadas das listas technical_data.applications)        */
/* ------------------------------------------------------------------ */

export type Application = {
  slug: string;
  name: string;
  pages: PageContent[];
  products: Product[];
  methodologies: string[];
  area: "diagnostico" | "life-sciences";
};

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildApplications(): Application[] {
  const map = new Map<string, Application>();

  for (const page of pages) {
    for (const name of page.technical_data.applications ?? []) {
      const slug = slugify(name);
      const entry =
        map.get(slug) ??
        ({
          slug,
          name,
          pages: [],
          products: [],
          methodologies: [],
          area: isLifeSciences(page) ? "life-sciences" : "diagnostico",
        } satisfies Application);
      entry.pages.push(page);
      for (const product of productsOfPage(page)) {
        if (!entry.products.includes(product)) entry.products.push(product);
      }
      for (const method of page.technical_data.methodologies ?? []) {
        if (!entry.methodologies.includes(method)) entry.methodologies.push(method);
      }
      map.set(slug, entry);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export const applications = buildApplications();
export const getApplication = (slug: string) => applications.find((a) => a.slug === slug);

/* ------------------------------------------------------------------ */
/* Documentação técnica                                                */
/* ------------------------------------------------------------------ */

export type DocumentEntry = {
  id: string;
  title: string;
  type: string;
  filename: string;
  product: Product;
  category: string;
  family: string;
  sku?: string | undefined;
};

export const documents: DocumentEntry[] = products.flatMap((product) =>
  product.documents.map((doc, index) => ({
    id: `${product.id}-${index}`,
    title: doc.title,
    type: doc.type,
    filename: doc.filename,
    product,
    category: product.category,
    family: product.family,
    sku: product.technical_data.sku,
  })),
);

export const documentTypes = Array.from(new Set(documents.map((d) => d.type))).sort();

/* ------------------------------------------------------------------ */
/* Busca client-side                                                   */
/* ------------------------------------------------------------------ */

export type SearchResult = {
  kind: "Produto" | "Categoria" | "Aplicação" | "Documento";
  title: string;
  meta: string;
  path: string;
  trail: string;
};

const searchIndex: (SearchResult & { haystack: string })[] = [
  ...products.map((product) => {
    const path = `/produto/${productSlug(product)}`;
    return {
      kind: "Produto" as const,
      title: product.name,
      meta: product.technical_data.sku ?? product.family,
      path,
      trail: product.category,
      haystack: [
        product.name,
        product.family,
        product.category,
        product.technical_data.sku,
        product.public_content.short_description,
        ...(product.technical_data.methodology ?? []),
      ]
        .join(" ")
        .toLowerCase(),
    };
  }),
  ...pages.map((page) => ({
    kind: "Categoria" as const,
    title: page.public_content.title,
    meta: page.page_type.replace(/_/g, " "),
    path: pagePath(page),
    trail: pageTrail(page)
      .map((p) => p.title)
      .join(" › "),
    haystack: [
      page.title,
      page.public_content.title,
      page.public_content.subtitle,
      page.public_content.short_description,
      ...(page.technical_data.applications ?? []),
      ...(page.technical_data.product_types ?? []),
    ]
      .join(" ")
      .toLowerCase(),
  })),
  ...applications.map((app) => ({
    kind: "Aplicação" as const,
    title: app.name,
    meta: `${app.products.length} produto(s) relacionados`,
    path: `/aplicacoes/${app.slug}`,
    trail: app.area === "diagnostico" ? "Diagnóstico & Imuno-hematologia" : "Pesquisa & Life Sciences",
    haystack: [app.name, ...app.methodologies].join(" ").toLowerCase(),
  })),
  ...documents.map((doc) => ({
    kind: "Documento" as const,
    title: doc.title,
    meta: doc.type,
    path: `/documentacao`,
    trail: doc.product.name,
    haystack: [doc.title, doc.type, doc.filename, doc.product.name, doc.sku ?? ""]
      .join(" ")
      .toLowerCase(),
  })),
];

export function search(query: string, limit = 12): SearchResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return searchIndex
    .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
    .slice(0, limit)
    .map(({ haystack: _haystack, ...rest }) => rest);
}

/* ------------------------------------------------------------------ */
/* Nota de transparência editorial (texto do próprio JSON)              */
/* ------------------------------------------------------------------ */

export const validationNote = project.validation_note;
