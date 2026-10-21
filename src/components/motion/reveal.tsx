"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { DUR, EASE, STAGGER } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number };

/** Entrada suave de um bloco: opacidade + subida curta (só transform/opacity: barato no celular). */
export function Reveal({ delay = 0, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.macro, ease: EASE.outSoft, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & { delay?: number; each?: number };

/** Container que revela os filhos (StaggerItem) em sequência. */
export function Stagger({ delay = 0, each = STAGGER.items, children, ...props }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: each, delayChildren: delay } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: DUR.macro, ease: EASE.outSoft } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
