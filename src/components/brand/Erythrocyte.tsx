import type { CSSProperties } from "react";
import { LOGO_CELLS } from "@/components/brand/LogoMark";

type Tone = "red" | "blue" | "outline";

type Props = {
  /** largura de render em px */
  size?: number;
  /** mantido por compatibilidade: define apenas a intensidade do acento */
  tone?: Tone;
  /** rotação estática, em graus */
  tilt?: number;
  /** achatamento: 1 = disco de frente, 0.35 = quase de perfil */
  flatten?: number;
  opacity?: number;
  /** qual das três hemácias da logo oficial usar (0, 1 ou 2) */
  variant?: 0 | 1 | 2;
  className?: string;
};

const TONE_OPACITY: Record<Tone, number> = { red: 1, blue: 0.9, outline: 0.28 };

/**
 * Hemácia da ImunoScan — recortada diretamente da logo oficial, sem redesenho.
 * Usada como assinatura visual em heros, transições e páginas de produto.
 */
export function Erythrocyte({
  size = 120,
  tone = "red",
  tilt = 0,
  flatten = 1,
  opacity = 1,
  variant = 2,
  className,
}: Props) {
  const cell = LOGO_CELLS[variant] ?? LOGO_CELLS[2];
  // a hemácia da logo já é fotográfica: achatamentos fortes deformariam a marca
  const squash = Math.min(1, Math.max(flatten, 0.85));

  return (
    <img
      src={cell.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={className}
      style={
        {
          width: size,
          height: size / cell.ratio,
          opacity: opacity * TONE_OPACITY[tone],
          transform: `rotate(${tilt}deg) scaleY(${squash})`,
          willChange: "transform",
        } as CSSProperties
      }
    />
  );
}

/** RBC Micro — marcador mínimo para bullets, indicadores e diagramas. */
export function RbcMicro({ size = 10, tone = "red" }: { size?: number; tone?: Tone }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background:
          tone === "blue"
            ? "radial-gradient(circle at 35% 30%, oklch(0.78 0.08 240), oklch(0.4571 0.1072 246.59))"
            : "radial-gradient(circle at 35% 30%, oklch(0.8 0.11 25), oklch(0.5032 0.1845 23.7))",
        boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.25)",
      }}
    />
  );
}
