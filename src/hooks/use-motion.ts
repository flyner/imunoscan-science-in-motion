import { useEffect, useRef, useState } from "react";

/** true quando o usuário pediu redução de movimento. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** true apenas em desktop com ponteiro fino. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    setFine(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setFine(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
}

/**
 * Observa a entrada do elemento na viewport uma única vez.
 * Usado para scroll reveals e para o gatilho da aglutinação.
 */
export function useInView<T extends HTMLElement>(options?: { rootMargin?: string; amount?: number }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: options?.rootMargin ?? "0px 0px -12% 0px", threshold: options?.amount ?? 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.amount]);

  return { ref, inView };
}

/**
 * Parallax de ponteiro com suavização (lerp por rAF) — nunca ligado
 * diretamente à posição do mouse. Expõe --px/--py no contêiner.
 * Desativado em reduced motion, touch e mobile.
 */
export function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !fine) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      node.style.setProperty("--px", currentX.toFixed(3));
      node.style.setProperty("--py", currentY.toFixed(3));
      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      start();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, fine]);

  return ref;
}
