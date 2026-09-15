import type { CSSProperties } from "react";
import cell01 from "@/assets/logo/red-cell-01.png";
import cell02 from "@/assets/logo/red-cell-02.png";
import cell03 from "@/assets/logo/red-cell-03.png";

/**
 * Os três glóbulos vermelhos da ImunoScan como elementos visuais independentes.
 * São os "átomos" da identidade: reconstroem o símbolo da marca na logo e
 * povoam o ambiente do site (hero, transições, páginas de produto).
 */
export const RED_CELLS = [
  { src: cell01, ratio: 424 / 398 },
  { src: cell02, ratio: 449 / 389 },
  { src: cell03, ratio: 397 / 402 },
] as const;

export type RedCellIndex = 0 | 1 | 2;

/** proporção (largura / altura) do símbolo reconstruído */
export const SYMBOL_RATIO = 1.16;

type CellLayer = {
  cell: RedCellIndex;
  /** estado base (repouso), em fração da largura/altura do símbolo */
  left: number;
  top: number;
  width: number;
  rotate: number;
  z: number;
  opacity: number;
  /** deslocamento de entrada: x, y, rotação */
  from: [number, number, number];
  /** microinteração de hover: x, y, rotação */
  hover: [number, number, number];
  ambient: 1 | 2 | 3;
  ambientDuration: string;
  ambientDelay: string;
  enterDelay: string;
  enterDuration: string;
};

const LAYERS: CellLayer[] = [
  {
    cell: 0,
    left: 0,
    top: 0.05,
    width: 0.62,
    rotate: -6,
    z: 1,
    opacity: 1,
    from: [-14, -9, -4],
    hover: [-3, -1.5, -1],
    ambient: 1,
    ambientDuration: "8.4s",
    ambientDelay: "-2.4s",
    enterDelay: "0ms",
    enterDuration: "620ms",
  },
  {
    cell: 1,
    left: 0.21,
    top: 0.46,
    width: 0.4,
    rotate: 11,
    z: 2,
    opacity: 1,
    from: [-6, 13, 5],
    hover: [-1.5, 2.5, 1.2],
    ambient: 2,
    ambientDuration: "6.8s",
    ambientDelay: "-5.1s",
    enterDelay: "85ms",
    enterDuration: "580ms",
  },
  {
    cell: 2,
    left: 0.46,
    top: 0.14,
    width: 0.55,
    rotate: -15,
    z: 3,
    opacity: 1,
    from: [16, -6, 3],
    hover: [3.5, 1, -0.8],
    ambient: 3,
    ambientDuration: "5.6s",
    ambientDelay: "-1.2s",
    enterDelay: "170ms",
    enterDuration: "640ms",
  },
];

type Props = {
  /** altura de render do símbolo, em px */
  height?: number;
  /** sequência de entrada (glóbulos convergindo para o símbolo) */
  entry?: boolean;
  /** movimento ambiental contínuo, independente por glóbulo */
  ambient?: boolean;
  /** microinteração de hover (apenas desktop com mouse) */
  interactive?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * Símbolo ImunoScan reconstruído com os três glóbulos independentes.
 * Cada glóbulo tem posição, escala, rotação, profundidade e timing próprios.
 */
export function AnimatedRedCells({
  height = 34,
  entry = true,
  ambient = true,
  interactive = true,
  priority = false,
  className,
}: Props) {
  return (
    <span
      aria-hidden="true"
      data-interactive={interactive ? "true" : "false"}
      className={`rc-field ${className ?? ""}`}
      style={{ width: height * SYMBOL_RATIO, height }}
    >
      {LAYERS.map((layer) => {
        const source = RED_CELLS[layer.cell]!;
        return (
          <span
            key={layer.cell}
            className="rc-cell"
            style={
              {
                left: `${layer.left * 100}%`,
                top: `${layer.top * 100}%`,
                width: `${layer.width * 100}%`,
                zIndex: layer.z,
                opacity: layer.opacity,
                "--hx": `${layer.hover[0]}px`,
                "--hy": `${layer.hover[1]}px`,
                "--hr": `${layer.hover[2]}deg`,
              } as CSSProperties
            }
          >
            <span
              className="rc-enter"
              data-entry={entry ? "true" : "false"}
              style={
                {
                  "--fx": `${layer.from[0]}px`,
                  "--fy": `${layer.from[1]}px`,
                  "--fr": `${layer.from[2]}deg`,
                  animationDelay: layer.enterDelay,
                  animationDuration: layer.enterDuration,
                } as CSSProperties
              }
            >
              <span
                className="rc-amb"
                data-ambient={ambient ? "true" : "false"}
                style={
                  {
                    animationName: `rc-amb-${layer.ambient}`,
                    animationDuration: layer.ambientDuration,
                    animationDelay: layer.ambientDelay,
                  } as CSSProperties
                }
              >
                <img
                  src={source.src}
                  alt=""
                  draggable={false}
                  decoding="async"
                  style={{ transform: `rotate(${layer.rotate}deg)`, aspectRatio: source.ratio }}
                  {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
                />
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
}
