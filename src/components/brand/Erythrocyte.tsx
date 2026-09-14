import type { CSSProperties } from "react";
import { LOGO_CELL } from "@/components/brand/LogoMark";

type Tone = "red" | "blue" | "outline";

type Props = {
  /** largura de render em px */
  size?: number;
  /** intensidade do acento (a cor da marca não é alterada) */
  tone?: Tone;
  /** rotação estática, em graus */
  tilt?: number;
  /** achatamento leve; nunca deforma a hemácia da marca */
  flatten?: number;
  opacity?: number;
  /** 1 espelha horizontalmente, para variar a composição sem redesenhar */
  variant?: 0 | 1 | 2;
  className?: string;
};

const TONE_OPACITY: Record<Tone, number> = { red: 1, blue: 0.9, outline: 0.28 };

/**
 * Hemácia ImunoScan — recortada da logo oficial, sem redesenho.
 * Assinatura visual usada em heros, transições e páginas de produto.
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
  const squash = Math.min(1, Math.max(flatten, 0.88));
  const mirror = variant === 1 ? -1 : 1;

  return (
    <img
      src={LOGO_CELL.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={className}
      style={
        {
          width: size,
          height: size / LOGO_CELL.ratio,
          opacity: opacity * TONE_OPACITY[tone],
          transform: `rotate(${tilt}deg) scale(${mirror}, ${squash})`,
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
