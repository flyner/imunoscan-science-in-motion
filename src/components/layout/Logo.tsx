import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/brand/LogoMark";

/** Logo oficial ImunoScan, animada em camadas (hemácias + wordmark). */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="press flex items-center"
      aria-label="ImunoScan — página inicial"
      title="ImunoScan"
    >
      <LogoMark height={compact ? 26 : 32} priority />
    </Link>
  );
}
