import type { CSSProperties } from "react";
import { RED_CELLS, type RedCellIndex } from "@/components/brand/AnimatedRedCells";

type Tone = "red" | "blue" | "outline";

type Props = {
  /** largura de render em px */
  size?: number;
  /** intensidade do acento (a cor da marca não é alterada) */
  tone?: Tone;
  /** rotação estática, em graus */
  tilt?: number;
  opacity?: number;
  /** qual dos três glóbulos da marca usar */
  variant?: RedCellIndex;
  /** espelha horizontalmente, variando a composição sem novos assets */
  mirror?: boolean;
  className?: string;
};

const TONE_OPACITY: Record<Tone, number> = { red: 1, blue: 0.9, outline: 0.3 };

/**
 * Glóbulo vermelho ImunoScan — o mesmo asset usado no símbolo da logo.
 * Reutilizado no hero, em transições de seção e em detalhes editoriais.
 */
export function Erythrocyte({
  size = 120,
  tone = "red",
  tilt = 0,
  opacity = 1,
  variant = 0,
  mirror = false,
  className,
}: Props) {
  const source = RED_CELLS[variant]!;

  return (
    <img
      src={source.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={className}
      style={
        {
          width: size,
          height: size / source.ratio,
          opacity: opacity * TONE_OPACITY[tone],
          transform: `rotate(${tilt}deg)${mirror ? " scaleX(-1)" : ""}`,
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
