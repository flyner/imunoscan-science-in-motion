import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/use-motion";

type Props = {
  children: ReactNode;
  /** atraso do stagger, em ms (40–70 por item é o padrão do design) */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/** Scroll reveal discreto: opacity + translateY curto, uma única vez. */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
