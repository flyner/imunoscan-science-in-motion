import { AnimatedRedCells, SYMBOL_RATIO } from "@/components/brand/AnimatedRedCells";
import wordmarkAsset from "@/assets/logo/wordmark.png.asset.json";

/** proporção largura/altura do wordmark original "ImunoScan" */
const WORDMARK_RATIO = 1110 / 182;
/** altura do wordmark em relação à altura do símbolo */
const WORDMARK_SCALE = 0.34;

export { SYMBOL_RATIO };

type Props = {
  /** altura de render do símbolo em px */
  height?: number;
  /** exibe o wordmark ao lado do símbolo */
  wordmark?: boolean;
  /** sequência de entrada ao carregar */
  entry?: boolean;
  /** movimento ambiental contínuo dos glóbulos */
  ambient?: boolean;
  /** microinteração de hover (desktop) */
  interactive?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * Logo ImunoScan: símbolo animado (três glóbulos independentes) + wordmark
 * original, que permanece estável, legível e sem movimento contínuo.
 */
export function LogoMark({
  height = 34,
  wordmark = true,
  entry = true,
  ambient = true,
  interactive = true,
  priority = false,
  className,
}: Props) {
  const wordHeight = height * WORDMARK_SCALE;

  return (
    <span
      role="img"
      aria-label="ImunoScan"
      className={`logo-mark ${className ?? ""}`}
      style={{ gap: height * 0.1 }}
    >
      <AnimatedRedCells
        height={height}
        entry={entry}
        ambient={ambient}
        interactive={interactive}
        priority={priority}
      />

      {wordmark && (
        <span
          className="logo-wordmark"
          data-entry={entry ? "true" : "false"}
          style={{ width: wordHeight * WORDMARK_RATIO, height: wordHeight }}
        >
          <img
            src={wordmarkAsset.url}
            alt=""
            aria-hidden="true"
            draggable={false}
            {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
          />
        </span>
      )}
    </span>
  );
}

export { SYMBOL_RATIO as LOGO_SYMBOL_RATIO };
