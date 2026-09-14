import { Erythrocyte } from "./Erythrocyte";
import { usePointerParallax } from "@/hooks/use-motion";

type Cell = {
  x: number;
  y: number;
  size: number;
  tilt: number;
  flatten: number;
  /** 1 = próxima (mais parallax), 0.2 = distante */
  depth: number;
  blur?: number;
  opacity?: number;
  duration: number;
  delay: number;
  alt?: boolean;
  tone?: "red" | "blue";
  mobile?: boolean;
};

const HERO_CELLS: Cell[] = [
  { x: 52, y: 16, size: 108, tilt: -14, flatten: 0.72, depth: 0.35, blur: 2.5, opacity: 0.5, duration: 13, delay: -2, mobile: false },
  { x: 12, y: 34, size: 96, tilt: 18, flatten: 0.6, depth: 0.5, blur: 1.4, opacity: 0.72, duration: 12, delay: -5, alt: true, mobile: false },
  { x: 62, y: 44, size: 224, tilt: -8, flatten: 0.86, depth: 1, duration: 11, delay: 0, mobile: true },
  { x: 26, y: 66, size: 148, tilt: 22, flatten: 0.66, depth: 0.8, duration: 14, delay: -3, alt: true, mobile: true },
  { x: 84, y: 74, size: 84, tilt: -26, flatten: 0.55, depth: 0.6, opacity: 0.85, duration: 10, delay: -6, mobile: true },
  { x: 46, y: 88, size: 56, tilt: 8, flatten: 0.5, depth: 0.45, blur: 1.2, opacity: 0.6, duration: 12, delay: -8, alt: true, mobile: false },
  { x: 90, y: 26, size: 44, tilt: 34, flatten: 0.78, depth: 0.3, blur: 2, opacity: 0.42, duration: 15, delay: -4, mobile: false },
];

/**
 * Composição ambiental de hemácias do hero.
 * Camadas: parallax suavizado (contêiner) + flutuação em CSS (elemento).
 */
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
            transform: `translate3d(calc(-50% + var(--px, 0) * ${(cell.depth * 16).toFixed(1)}px), calc(-50% + var(--py, 0) * ${(cell.depth * 12).toFixed(1)}px), 0)`,
            filter: cell.blur
              ? `blur(${cell.blur}px) drop-shadow(0 24px 40px oklch(0.5032 0.1845 23.7 / 0.12))`
              : "drop-shadow(0 26px 44px oklch(0.5032 0.1845 23.7 / 0.18))",
          }}
        >
          <div
            className={cell.alt ? "rbc-motion-alt" : "rbc-motion"}
            style={
              {
                "--rbc-duration": `${cell.duration}s`,
                "--rbc-delay": `${cell.delay}s`,
              } as React.CSSProperties
            }
          >
            <Erythrocyte
              size={cell.size}
              tilt={cell.tilt}
              flatten={cell.flatten}
              opacity={cell.opacity ?? 1}
              tone={cell.tone ?? "red"}
              variant={(index % 3) as 0 | 1 | 2}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Assinatura discreta: uma ou duas hemácias em profundidade. */
export function RbcAccent({
  className = "",
  size = 140,
  tone = "red",
  tilt = -12,
  opacity = 0.16,
}: {
  className?: string;
  size?: number;
  tone?: "red" | "blue";
  tilt?: number;
  opacity?: number;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className="rbc-motion" style={{ "--rbc-duration": "14s" } as React.CSSProperties}>
        <Erythrocyte size={size} tone={tone} tilt={tilt} flatten={0.7} opacity={opacity} />
      </div>
    </div>
  );
}
