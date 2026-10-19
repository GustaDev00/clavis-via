"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert } from "lucide-react";
import { DUR, EASE } from "@/lib/motion";

/**
 * Mensagem geral do formulário (falha de rede, sessão, banco).
 * Abre animando a altura, então o conteúdo abaixo desliza em vez de pular.
 */
export function FormMessage({ message, attempt }: { message?: string; attempt?: number }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          key="form-message"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DUR.meso, ease: EASE.outSoft }}
          className="overflow-hidden"
        >
          <motion.div
            key={attempt}
            role="alert"
            initial={{ x: 0 }}
            animate={{ x: [0, -3, 3, -2, 0] }}
            transition={{ duration: DUR.meso, ease: EASE.outSoft }}
            className="flex items-start gap-2.5 rounded-2xl border border-error-line/30 bg-error-bg px-4 py-3 text-sm font-medium text-error"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{message}</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
