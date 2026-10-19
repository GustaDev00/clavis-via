"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "@/lib/motion";

/** Número que conta até o valor final (dias seguidos, dias concluídos). */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduce) {
      element.textContent = String(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE.outExpo,
      onUpdate: (latest) => {
        element.textContent = String(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {value}
    </span>
  );
}
