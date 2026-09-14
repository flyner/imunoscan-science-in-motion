import { useId } from "react";

type Tone = "red" | "blue" | "outline";

type Props = {
  /** aresta em px */
  size?: number;
  tone?: Tone;
  /** rotação estática, em graus */
  tilt?: number;
  /** achatamento: 1 = disco de frente, 0.35 = quase de perfil */
  flatten?: number;
  opacity?: number;
  className?: string;
};

const TONES: Record<Tone, { rim: string; body: string; core: string; shine: string }> = {
  red: {
    rim: "oklch(0.5032 0.1845 23.7)",
    body: "oklch(0.6041 0.2028 23.11)",
    core: "oklch(0.4571 0.1445 23.7)",
    shine: "oklch(0.86 0.07 25)",
  },
  blue: {
    rim: "oklch(0.4571 0.1072 246.59)",
    body: "oklch(0.6386 0.1249 241.04)",
    core: "oklch(0.4 0.09 246)",
    shine: "oklch(0.9 0.04 240)",
  },
  outline: {
    rim: "oklch(0.5032 0.1845 23.7 / 0.35)",
    body: "oklch(0.6041 0.2028 23.11 / 0.14)",
    core: "oklch(0.5032 0.1845 23.7 / 0.22)",
    shine: "oklch(1 0 0 / 0.5)",
  },
};

/**
 * Hemácia proprietária ImunoScan — disco bicôncavo pseudo-3D em SVG puro.
 * Sem imagens, sem canvas: escala livre e custo de render mínimo.
 */
export function Erythrocyte({
  size = 120,
  tone = "red",
  tilt = 0,
  flatten = 0.82,
  opacity = 1,
  className,
}: Props) {
  const id = useId().replace(/:/g, "");
  const c = TONES[tone];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ opacity, overflow: "visible" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`body-${id}`} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor={c.shine} />
          <stop offset="42%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.rim} />
        </radialGradient>
        <radialGradient id={`dimple-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.core} stopOpacity="0.85" />
          <stop offset="65%" stopColor={c.core} stopOpacity="0.28" />
          <stop offset="100%" stopColor={c.core} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`shine-${id}`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={c.shine} stopOpacity="0.75" />
          <stop offset="100%" stopColor={c.shine} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform={`rotate(${tilt} 100 100)`}>
        <g transform={`translate(0 ${(1 - flatten) * 46}) scale(1 ${flatten})`}>
          <ellipse cx="100" cy="100" rx="92" ry="92" fill={`url(#body-${id})`} />
          <ellipse cx="100" cy="102" rx="52" ry="50" fill={`url(#dimple-${id})`} />
          <ellipse
            cx="76"
            cy="62"
            rx="40"
            ry="26"
            fill={`url(#shine-${id})`}
            transform="rotate(-28 76 62)"
          />
          <ellipse
            cx="100"
            cy="100"
            rx="91"
            ry="91"
            fill="none"
            stroke={c.rim}
            strokeOpacity="0.5"
            strokeWidth="2"
          />
        </g>
      </g>
    </svg>
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
