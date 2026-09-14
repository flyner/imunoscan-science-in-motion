import { Link } from "@tanstack/react-router";
import { Erythrocyte } from "@/components/brand/Erythrocyte";
import { LogoMark } from "@/components/brand/LogoMark";
import { AppLink } from "@/components/ui/AppLink";
import {
  diagnosticCategories,
  lifeSciencesCategories,
  pagePath,
  project,
  validationNote,
} from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8 overflow-hidden bg-ink-950 text-white/80">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 hidden md:block"
        style={{ filter: "blur(1px)" }}
      >
        <Erythrocyte size={340} tilt={-16} variant={2} opacity={0.14} />
      </div>

      <div className="shell relative section-y-sm">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-flex items-center rounded-lg bg-white px-3.5 py-2.5">
              <LogoMark height={30} entry={false} interactive={false} />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{project.legal_entity}</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/55">{project.target_audience}</p>
          </div>

          <FooterColumn title="Diagnóstico">
            {diagnosticCategories.map((page) => (
              <FooterLink key={page.id} to={pagePath(page)}>
                {page.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Life Sciences">
            {lifeSciencesCategories.slice(0, 6).map((page) => (
              <FooterLink key={page.id} to={pagePath(page)}>
                {page.title}
              </FooterLink>
            ))}
            <FooterLink to="/life-sciences">Ver todas as categorias</FooterLink>
          </FooterColumn>

          <FooterColumn title="Institucional">
            <FooterLink to="/produtos">Produtos</FooterLink>
            <FooterLink to="/aplicacoes">Aplicações</FooterLink>
            <FooterLink to="/documentacao">Documentação técnica</FooterLink>
            <FooterLink to="/a-imunoscan">A ImunoScan</FooterLink>
            <FooterLink to="/cotacao">Solicitar cotação</FooterLink>
            <FooterLink to="/contato">Contato</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/45">
          <p className="max-w-3xl">{validationNote}</p>
          <p className="mt-3">
            © {year} {project.legal_entity}. Conteúdo técnico destinado a profissionais de saúde e pesquisa.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  const isStatic = ["/produtos", "/aplicacoes", "/documentacao", "/a-imunoscan", "/cotacao", "/contato", "/life-sciences"].includes(to);

  return (
    <li>
      {isStatic ? (
        <Link
          to={to as "/produtos"}
          className="text-sm text-white/75 transition-colors duration-[var(--duration-fast)] hover:text-white"
        >
          {children}
        </Link>
      ) : (
        <AppLink
          to={to}
          className="text-sm text-white/75 transition-colors duration-[var(--duration-fast)] hover:text-white"
        >
          {children}
        </AppLink>
      )}
    </li>
  );
}
