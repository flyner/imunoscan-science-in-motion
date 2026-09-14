import type { CSSProperties } from "react";
import { Erythrocyte } from "./Erythrocyte";
import type { RedCellIndex } from "./AnimatedRedCells";
import { usePointerParallax } from "@/hooks/use-motion";

type Cell = {
  x: number;
  y: number;
  size: number;
  tilt: number;
  /** qual dos três glóbulos da marca */
  variant: RedCellIndex;
  mirror?: boolean;
  /** 1 = camada frontal (mais parallax), 0.25 = fundo */
  depth: number;
  blur?: number;
  opacity?: number;
  duration: number;
  delay: number;
  alt?: boolean;
  /** false = oculto no mobile */
  mobile?: boolean;
};

/**
 * Composição deliberada em três camadas:
 * fundo (pequeno, suave, lento) · intermediária · frontal (grande, nítida).
 */
const HERO_CELLS: Cell[] = [
  // fundo
  { x: 55, y: 15, size: 96, tilt: -16, variant: 1, depth: 0.3, blur: 2.6, opacity: 0.42, duration: 15, delay: -2, mobile: false },
  { x: 91, y: 27, size: 58, tilt: 30, variant: 2, depth: 0.28, blur: 2.2, opacity: 0.38, duration: 16, delay: -7, alt: true, mobile: false },
  { x: 45, y: 89, size: 62, tilt: 10, variant: 0, depth: 0.32, blur: 1.8, opacity: 0.4, duration: 14, delay: -10, mobile: false },
  // intermediária
  { x: 13, y: 33, size: 104, tilt: 18, variant: 2, mirror: true, depth: 0.6, opacity: 0.78, duration: 12, delay: -5, alt: true, mobile: false },
  { x: 85, y: 73, size: 92, tilt: -24, variant: 1, depth: 0.62, opacity: 0.8, duration: 11, delay: -6, mobile: true },
  // frontal
  { x: 63, y: 45, size: 226, tilt: -8, variant: 0, depth: 1, duration: 13, delay: 0, mobile: true },
  { x: 27, y: 67, size: 148, tilt: 16, variant: 2, depth: 0.85, duration: 14, delay: -3, alt: true, mobile: true },
];

export function RbcField({
  cells = HERO_CELLS,
  className = "",
}: {
  cells?: Cell[];
  className?: string;
}) {
  const ref = usePointerParallax<HTMLDivElement>();

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {cells.map((cell, index) => (
        <div
          key={index}
          className={cell.mobile === false ? "absolute hidden md:block" : "absolute"}
          style={{
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            transform: `translate3d(calc(-50% + var(--px, 0) * ${(cell.depth * 15).toFixed(1)}px), calc(-50% + var(--py, 0) * ${(cell.depth * 11).toFixed(1)}px), 0)`,
            filter: cell.blur
              ? `blur(${cell.blur}px) drop-shadow(0 22px 38px oklch(0.5032 0.1845 23.7 / 0.10))`
              : "drop-shadow(0 26px 44px oklch(0.5032 0.1845 23.7 / 0.16))",
          }}
        >
          <div
            className={cell.alt ? "rbc-motion-alt" : "rbc-motion"}
            style={
              {
                "--rbc-duration": `${cell.duration}s`,
                "--rbc-delay": `${cell.delay}s`,
              } as CSSProperties
            }
          >
            <Erythrocyte
              size={cell.size}
              tilt={cell.tilt}
              opacity={cell.opacity ?? 1}
              variant={cell.variant}
              {...(cell.mirror ? { mirror: true } : {})}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Assinatura discreta: um glóbulo da marca, em profundidade. */
export function RbcAccent({
  className = "",
  size = 140,
  tone = "red",
  tilt = -12,
  opacity = 0.16,
  variant = 0,
}: {
  className?: string;
  size?: number;
  tone?: "red" | "blue";
  tilt?: number;
  opacity?: number;
  variant?: RedCellIndex;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className="rbc-motion" style={{ "--rbc-duration": "14s" } as CSSProperties}>
        <Erythrocyte size={size} tone={tone} tilt={tilt} opacity={opacity} variant={variant} />
      </div>
    </div>
  );
}
