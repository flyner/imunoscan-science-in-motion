import { Link } from "@tanstack/react-router";
import { Erythrocyte } from "@/components/brand/Erythrocyte";

/**
 * Assinatura da marca: hemácia (origem histórica da logomarca) + wordmark
 * tipográfico. Nenhum arquivo oficial de logo foi fornecido no pacote.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="press flex items-center gap-2.5" aria-label="ImunoScan — página inicial">
      <span className="grid place-items-center transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)]">
        <Erythrocyte size={compact ? 24 : 28} tilt={-12} flatten={0.8} />
      </span>
      <span
        className="font-display font-semibold tracking-[-0.03em] text-ink-950 transition-[font-size] duration-[var(--duration-ui)] ease-[var(--ease-out)]"
        style={{ fontSize: compact ? "1.05rem" : "1.2rem" }}
      >
        Imuno<span className="text-red-600">Scan</span>
      </span>
    </Link>
  );
}
