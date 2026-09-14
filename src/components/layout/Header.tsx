import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { SearchDialog } from "@/components/search/SearchDialog";

const NAV = [
  { label: "Produtos", to: "/produtos" },
  { label: "Aplicações", to: "/aplicacoes" },
  { label: "Life Sciences", to: "/life-sciences" },
  { label: "Documentação", to: "/documentacao" },
  { label: "A ImunoScan", to: "/a-imunoscan" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-[var(--shadow-sm)]"
      >
        Ir para o conteúdo
      </a>

      <header
        data-scrolled={scrolled ? "true" : "false"}
        className="sticky top-0 z-50 border-b border-transparent bg-white/95 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-ui)] ease-[var(--ease-out)] data-[scrolled=true]:border-[var(--border-subtle)] data-[scrolled=true]:bg-white/80 data-[scrolled=true]:backdrop-blur-md"
      >
        <div className="shell flex items-center justify-between gap-6 py-3 md:py-4">
          <Logo compact={scrolled} />

          <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="link-underline text-sm font-medium text-ink-800 transition-colors duration-[var(--duration-fast)] hover:text-blue-700"
                activeProps={{ className: "text-blue-700" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="press grid size-10 place-items-center rounded-lg border text-ink-800 hover:border-blue-600 hover:text-blue-700"
              aria-label="Abrir busca técnica"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <ButtonLink to="/cotacao" className="hidden sm:inline-flex">
              Solicitar cotação
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="press grid size-10 place-items-center rounded-lg border text-ink-800 lg:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="menu-mobile" className="border-t bg-white lg:hidden">
            <nav aria-label="Navegação principal (mobile)" className="shell flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b py-3.5 text-[0.95rem] font-medium text-ink-800 last:border-b-0"
                  activeProps={{ className: "text-blue-700" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 py-4">
                <ButtonLink to="/cotacao" className="flex-1">
                  Solicitar cotação
                </ButtonLink>
                <ButtonLink to="/contato" variant="secondary" className="flex-1">
                  Contato
                </ButtonLink>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
