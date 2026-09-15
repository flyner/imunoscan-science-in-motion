import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Links | ImunoScan" },
      {
        name: "description",
        content:
          "Acesso rápido às principais seções do site ImunoScan: produtos, aplicações, informações técnicas, cotação e contato.",
      },
      { property: "og:title", content: "Links | ImunoScan" },
      {
        property: "og:description",
        content:
          "Acesso rápido às principais seções do site ImunoScan: produtos, aplicações, informações técnicas, cotação e contato.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LinksPage,
});

const LINKS = [
  {
    to: "/produtos",
    title: "Produtos",
    description: "Catálogo completo de reagentes e soluções para diagnóstico.",
  },
  {
    to: "/diagnostico-imuno-hematologia",
    title: "Diagnóstico & Imuno-hematologia",
    description: "Linha dedicada a imuno-hematologia e bancos de sangue.",
  },
  {
    to: "/life-sciences",
    title: "Life Sciences",
    description: "Soluções para pesquisa e laboratórios de ciências da vida.",
  },
  {
    to: "/aplicacoes",
    title: "Aplicações",
    description: "Aplicações por área de uso e metodologia.",
  },
  {
    to: "/documentacao",
    title: "Informações técnicas",
    description: "Documentação técnica, instruções de uso e materiais de apoio.",
  },
  {
    to: "/a-imunoscan",
    title: "Quem somos",
    description: "Conheça a ImunoScan, sua história e atuação.",
  },
  {
    to: "/cotacao",
    title: "Solicitar cotação",
    description: "Solicite uma cotação de produtos com nossa equipe comercial.",
  },
  {
    to: "/contato",
    title: "Contato",
    description: "Fale com a ImunoScan pelos nossos canais de atendimento.",
  },
] as const;

function LinksPage() {
  return (
    <main id="conteudo" className="shell py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
          Links
        </h1>
        <p className="mt-3 text-ink-600">
          Acesso rápido às principais seções do site.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="group block h-full rounded-xl border border-[var(--border-subtle)] bg-white p-5 transition-[border-color,box-shadow] duration-[var(--duration-ui)] hover:border-blue-600 hover:shadow-[var(--shadow-sm)]"
            >
              <h2 className="font-semibold text-ink-900 transition-colors duration-[var(--duration-fast)] group-hover:text-blue-700">
                {link.title}
              </h2>
              <p className="mt-1.5 text-sm text-ink-600">{link.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
