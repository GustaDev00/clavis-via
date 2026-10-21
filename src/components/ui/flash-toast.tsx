"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { EASE, SPRING } from "@/lib/motion";

/**
 * Confirmação após uma ação salva (check-in, prática, dia do plano).
 * A página recebe a mensagem pela URL (?salvo=...), mostra o toast e limpa a URL
 * sem nova navegação — atualizar a página depois não repete a mensagem.
 */
export function FlashToast({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    const url = new URL(window.location.href);
    ["salvo", "concluido", "reiniciado"].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState(window.history.state, "", url.pathname + url.search);

    const timer = window.setTimeout(() => setVisible(false), 4200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    // A região live existe sempre (mesmo vazia): leitores de tela anunciam melhor conteúdo
    // inserido numa região já presente do que uma região criada junto com o texto.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom)+16px)] z-50 flex justify-center px-5 md:bottom-8 md:left-[96px] lg:left-[256px]"
    >
      <AnimatePresence>
        {visible && message ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { ...SPRING.sheet, delay: 0.35 } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease: EASE.exit } }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => info.offset.y > 24 && setVisible(false)}
            onClick={() => setVisible(false)}
            className="pointer-events-auto flex w-full max-w-[calc(var(--app-max)-40px)] cursor-pointer items-center gap-3 rounded-2xl bg-navy px-4 py-3.5 text-sm font-medium text-white shadow-float"
          >
            <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-700">
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { ...SPRING.pop, delay: 0.5 } }}
              >
                <Check className="size-4" strokeWidth={3} aria-hidden />
              </motion.span>
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-sage-100 motion-safe:animate-[cv-halo_0.9s_var(--ease-out-soft)_0.5s_both]"
              />
            </span>
            <span>{message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
