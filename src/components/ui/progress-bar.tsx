"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

/**
 * Barra de progresso que preenche por translate (não por scaleX, que deformaria as pontas).
 * O texto ao lado/abaixo carrega a informação; a cor é decorativa.
 */
export function ProgressBar({
  percent,
  label,
  className,
  delay = 0.2,
}: {
  percent: number;
  label: string;
  className?: string;
  delay?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label}
      className={cn("h-2 overflow-hidden rounded-full bg-sunken", className)}
    >
      <motion.div
        className="h-full w-full rounded-full bg-[image:var(--grad-progress)]"
        initial={{ x: "-100%" }}
        animate={{ x: `${clamped - 100}%` }}
        transition={{ duration: 0.9, ease: EASE.outExpo, delay }}
      />
    </div>
  );
}
