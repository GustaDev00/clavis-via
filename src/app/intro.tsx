"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { KeyMark } from "@/components/brand/key-mark";

/**
 * Abertura da Entrada (técnica "preloader que nasce do símbolo"):
 * 1. a chave se desenha traço a traço; 2. o nome surge letra a letra;
 * 3. a frase revela por linhas; 4. pilares e formulário sobem em sequência.
 *
 * Os elementos começam ocultos via CSS (data-intro="pending") para não "piscarem" antes da
 * hidratação; o GSAP assume o controle e revela. Movimento reduzido: fades curtos.
 */
export function Intro({ pillars, children }: { pillars: ReactNode; children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const hero = q("[data-intro-hero]");
          const pillarItems = q("[data-intro-pillar]");
          const steps = q("[data-intro-step]");
          gsap.set([...hero, ...pillarItems, ...steps], { autoAlpha: 0 });
          root.dataset.intro = "ready";

          if (context.conditions?.reduce) {
            gsap.to([...hero, ...pillarItems, ...steps], { autoAlpha: 1, duration: 0.3, stagger: 0.05 });
            return;
          }

          gsap.set(hero, { autoAlpha: 1 });
          const wordmark = SplitText.create(q("[data-intro-wordmark]"), { type: "chars", aria: "hidden" });
          const tagline = SplitText.create(q("[data-intro-tagline]"), { type: "lines", mask: "lines", aria: "none" });
          tagline.masks?.forEach((mask) => mask.classList.add("split-line-mask"));

          const rise = { y: 0, autoAlpha: 1, filter: "blur(0px)" };

          gsap
            .timeline({ defaults: { ease: "cv.outSoft" } })
            .fromTo(
              q("[data-key-part]"),
              { drawSVG: 0 },
              { drawSVG: "100%", duration: 1.1, stagger: 0.09, ease: "cv.inOutSoft" },
            )
            .fromTo(q("[data-intro-key]"), { y: 10, scale: 0.94 }, { y: 0, scale: 1, duration: 1.2, ease: "expo.out" }, 0)
            .fromTo(
              wordmark.chars,
              { autoAlpha: 0, yPercent: 60, filter: "blur(6px)" },
              { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.035 },
              0.55,
            )
            .fromTo(tagline.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.95)
            .fromTo(pillarItems, { y: 14, autoAlpha: 0, filter: "blur(4px)" }, { ...rise, duration: 0.6, stagger: 0.08 }, 1.2)
            .fromTo(steps, { y: 16, autoAlpha: 0, filter: "blur(4px)" }, { ...rise, duration: 0.7, stagger: 0.08 }, 1.45);
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} data-intro="pending" className="group/intro flex flex-1 flex-col">
      <noscript>
        <style>{`[data-intro-hero],[data-intro-pillar],[data-intro-step]{visibility:visible!important;opacity:1!important}`}</style>
      </noscript>

      <div
        data-intro-hero
        className="flex flex-col items-center gap-5 pt-6 text-center group-data-[intro=pending]/intro:invisible"
      >
        <div data-intro-key className="relative">
          <span aria-hidden className="absolute inset-[-28px] rounded-full bg-lav-200/60 blur-2xl" />
          <KeyMark className="relative h-24 w-auto" />
        </div>
        <h1 className="flex flex-col items-center gap-1 text-ink" aria-label="CLAVIS VIA">
          {/* padding-left compensa o letter-spacing depois da última letra e centraliza a palavra */}
          <span data-intro-wordmark className="type-display pl-[0.22em] text-[52px] leading-none tracking-[0.22em]">
            CLAVIS
          </span>
          <span data-intro-wordmark className="type-display pl-[0.22em] text-[52px] leading-none tracking-[0.22em]">
            VIA
          </span>
        </h1>
        <p data-intro-tagline className="type-display max-w-[16ch] text-[26px] leading-[1.15] text-text-soft italic">
          Seu caminho de volta para si, todos os dias.
        </p>
      </div>

      <ul className="mt-10 flex flex-col gap-4 group-data-[intro=pending]/intro:invisible">{pillars}</ul>

      <div className="mt-auto flex flex-col gap-4 pt-10 group-data-[intro=pending]/intro:invisible">{children}</div>
    </div>
  );
}
