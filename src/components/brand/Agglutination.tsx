import { Erythrocyte } from "./Erythrocyte";
import { useInView } from "@/hooks/use-motion";

type Cell = { x: number; y: number; fromX: number; fromY: number; size: number; delay: number; tilt: number };

/** Dois agrupamentos: hemácias afastadas que se aproximam ao entrar na seção. */
const CLUSTER_A: Cell[] = [
  { x: 24, y: 40, fromX: -70, fromY: -34, size: 46, delay: 0, tilt: -10 },
  { x: 33, y: 52, fromX: 62, fromY: -48, size: 52, delay: 120, tilt: 14 },
  { x: 20, y: 60, fromX: -34, fromY: 62, size: 40, delay: 240, tilt: 26 },
  { x: 31, y: 32, fromX: 26, fromY: -76, size: 36, delay: 320, tilt: -22 },
];

const CLUSTER_B: Cell[] = [
  { x: 66, y: 34, fromX: 78, fromY: -30, size: 44, delay: 180, tilt: 8 },
  { x: 74, y: 46, fromX: 96, fromY: 40, size: 50, delay: 300, tilt: -16 },
  { x: 63, y: 56, fromX: 30, fromY: 88, size: 38, delay: 420, tilt: 20 },
];

const FREE: Cell[] = [
  { x: 47, y: 22, fromX: 0, fromY: 0, size: 26, delay: 0, tilt: 0 },
  { x: 50, y: 74, fromX: 0, fromY: 0, size: 22, delay: 0, tilt: 12 },
  { x: 90, y: 70, fromX: 0, fromY: 0, size: 20, delay: 0, tilt: -8 },
];

export function Agglutination({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.4 });

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-surface ${className}`}
      role="img"
      aria-label="Representação conceitual da hemaglutinação: hemácias dispersas que se aproximam formando pequenos agrupamentos."
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 25%, oklch(0.6041 0.2028 23.11 / 0.05), transparent 60%), radial-gradient(circle at 75% 70%, oklch(0.6386 0.1249 241.04 / 0.05), transparent 60%)",
        }}
      />
      {[...CLUSTER_A, ...CLUSTER_B, ...FREE].map((cell, index) => (
        <div
          key={index}
          className="cluster-cell absolute"
          data-clustered={inView ? "true" : "false"}
          style={
            {
              left: `${cell.x}%`,
              top: `${cell.y}%`,
              marginLeft: -cell.size / 2,
              marginTop: -cell.size / 2,
              "--from-x": `${cell.fromX}px`,
              "--from-y": `${cell.fromY}px`,
              "--cluster-delay": `${cell.delay}ms`,
            } as React.CSSProperties
          }
        >
          <Erythrocyte size={cell.size} tilt={cell.tilt} flatten={0.78} />
        </div>
      ))}
    </div>
  );
}
