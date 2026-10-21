"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { DUR, STAGGER } from "@/lib/motion";

type Props = {
  as?: "h1" | "h2" | "p";
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Título revelado linha a linha por máscara (técnica dos vencedores Lando Norris / Méline Gobet).
 * - `autoSplit` refaz a divisão quando a fonte termina de carregar ou a largura muda.
 * - Movimento reduzido: apenas um fade curto.
 * - Divisão só por linhas (aria: "none"): o texto continua legível para leitores de tela.
 * - Começa oculto por CSS (data-reveal-pending) só até o GSAP assumir; sem JS, um <noscript>
 *   no layout raiz deixa tudo visível.
 */
export function RevealHeading({ as: Tag = "h1", children, className, delay = 0, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          gsap.set(element, { autoAlpha: 1 });

          if (context.conditions?.reduce) {
            gsap.from(element, { autoAlpha: 0, duration: 0.2, delay });
            return;
          }

          SplitText.create(element, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            // Linhas mantêm as palavras inteiras: o leitor de tela lê o texto normalmente
            aria: "none",
            autoSplit: true,
            onSplit: (self) => {
              self.masks?.forEach((mask) => mask.classList.add("split-line-mask"));
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: DUR.reveal,
                ease: "expo.out",
                stagger: STAGGER.lines,
                delay,
              });
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-reveal-pending="" className={className}>
      {children}
    </Tag>
  );
}
