import type { CSSProperties } from "react";
import cellA from "@/assets/logo/cell-a.png.asset.json";
import cellB from "@/assets/logo/cell-b.png.asset.json";
import cellC from "@/assets/logo/cell-c.png.asset.json";
import wordmarkAsset from "@/assets/logo/wordmark.png.asset.json";

/**
 * Logo oficial ImunoScan, decomposta em camadas a partir do arquivo original
 * (três hemácias + wordmark). Nenhum pixel foi redesenhado: as camadas
 * recompõem exatamente a arte original e apenas ganham movimento independente.
 */

export const LOGO_RATIO = 1920 / 647;
/** proporção do bloco só de hemácias (sem wordmark) */
export const CELLS_RATIO = 0.37 / 0.94;

type Layer = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  z: number;
  /** posição/rotação inicial da entrada */
  from: [number, number, number];
  /** reação de hover, em px e graus */
  hover: [number, number, number];
  ambient: 1 | 2 | 3;
  ambientDuration: string;
  ambientDelay: string;
  enterDelay: string;
  enterDuration: string;
};

const LAYERS: Layer[] = [
  {
    src: cellA.url,
    left: 0.0375,
    top: 0.04946,
    width: 0.33333,
    height: 0.84235,
    z: 1,
    from: [-13, 9, -3],
    hover: [-2.5, -1.5, -0.7],
    ambient: 1,
    ambientDuration: "17s",
    ambientDelay: "-2.4s",
    enterDelay: "40ms",
    enterDuration: "620ms",
  },
  {
    src: cellB.url,
    left: 0.03646,
    top: 0.35858,
    width: 0.14896,
    height: 0.45286,
    z: 2,
    from: [-7, 15, 3],
    hover: [-2, 2.5, 0.9],
    ambient: 2,
    ambientDuration: "13.5s",
    ambientDelay: "-6.1s",
    enterDelay: "130ms",
    enterDuration: "580ms",
  },
  {
    src: cellC.url,
    left: 0.14531,
    top: 0.20093,
    width: 0.20781,
    height: 0.56723,
    z: 3,
    from: [15, 10, -2],
    hover: [3, 1, -0.6],
    ambient: 3,
    ambientDuration: "10.5s",
    ambientDelay: "-1.2s",
    enterDelay: "215ms",
    enterDuration: "640ms",
  },
];

const WORDMARK = { left: 0.38854, top: 0.53323, width: 0.57812, height: 0.2813 };

type Props = {
  /** altura de render em px */
  height?: number;
  /** exibe o wordmark; false renderiza apenas o bloco de hemácias */
  wordmark?: boolean;
  /** sequência de entrada ao carregar */
  entry?: boolean;
  /** movimento ambiental contínuo */
  ambient?: boolean;
  /** microinteração de hover (desktop) */
  interactive?: boolean;
  priority?: boolean;
  className?: string;
};

export function LogoMark({
  height = 34,
  wordmark = true,
  entry = true,
  ambient = true,
  interactive = true,
  priority = false,
  className,
}: Props) {
  // sem wordmark, o quadro é recortado para o bloco de hemácias
  const frameWidth = wordmark ? height * LOGO_RATIO : height * CELLS_RATIO;
  const scale = wordmark ? 1 : 1 / 0.37;
  const offsetX = wordmark ? 0 : -0.0375;

  return (
    <span
      role="img"
      aria-label="ImunoScan"
      data-interactive={interactive ? "true" : "false"}
      className={`logo-mark ${className ?? ""}`}
      style={{ width: frameWidth, height }}
    >
      {LAYERS.map((layer) => (
        <span
          key={layer.src}
          className="logo-cell"
          style={
            {
              left: `${(layer.left + offsetX) * 100 * scale}%`,
              top: `${layer.top * 100}%`,
              width: `${layer.width * 100 * scale}%`,
              height: `${layer.height * 100}%`,
              zIndex: layer.z,
              "--hx": `${layer.hover[0]}px`,
              "--hy": `${layer.hover[1]}px`,
              "--hr": `${layer.hover[2]}deg`,
            } as CSSProperties
          }
        >
          <span
            className="logo-cell-enter"
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
              className="logo-cell-ambient"
              data-ambient={ambient ? "true" : "false"}
              style={
                {
                  animationName: `logo-amb-${layer.ambient}`,
                  animationDuration: layer.ambientDuration,
                  animationDelay: layer.ambientDelay,
                } as CSSProperties
              }
            >
              <img src={layer.src} alt="" aria-hidden="true" draggable={false} />
            </span>
          </span>
        </span>
      ))}

      {wordmark && (
        <span
          className="logo-wordmark"
          data-entry={entry ? "true" : "false"}
          style={{
            left: `${WORDMARK.left * 100}%`,
            top: `${WORDMARK.top * 100}%`,
            width: `${WORDMARK.width * 100}%`,
            height: `${WORDMARK.height * 100}%`,
          }}
        >
          <img
            src={wordmarkAsset.url}
            alt=""
            aria-hidden="true"
            draggable={false}
            {...(priority ? { fetchPriority: "high" as const } : {})}
          />
        </span>
      )}
    </span>
  );
}

/**
 * Hemácia isolada da logo oficial — assinatura visual reutilizável.
 * Índice 0/1/2 seleciona qual das três células da marca é usada.
 */
/**
 * Para uso isolado fora da logo usamos apenas a hemácia frontal da marca:
 * é a única cujo contorno está completo no arquivo original (as outras duas
 * ficam parcialmente cobertas na composição).
 */
export const LOGO_CELL = {
  src: cellC.url,
  ratio: (0.20781 / 0.56723) * LOGO_RATIO,
} as const;
