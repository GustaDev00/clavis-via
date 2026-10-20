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
            .to(q("[data-intro-sweep]"), { xPercent: 520, duration: 1.4, ease: "cv.inOutSoft" }, 0.9)
            .fromTo(
              wordmark.chars,
              { autoAlpha: 0, yPercent: 60, filter: "blur(6px)" },
              { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.035 },
              0.55,
            )
            .fromTo(tagline.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.95)
            .fromTo(pillarItems, { y: 14, autoAlpha: 0, filter: "blur(4px)" }, { ...rise, duration: 0.6, stagger: 0.08 }, 1.2)
            .fromTo(steps, { y: 16, autoAlpha: 0, filter: "blur(4px)" }, { ...rise, duration: 0.7, stagger: 0.08 }, 1.45);

          // Deriva ociosa da fechadura: duas senoides com períodos incomensuráveis (nunca repete igual)
          const keyhole = q("[data-intro-keyhole]");
          const drift = (time: number) => {
            gsap.set(keyhole, {
              y: 3 * Math.sin(time * 0.37) + 1.5 * Math.sin(time * 0.91),
              rotation: 1.1 * Math.sin(time * 0.29),
            });
          };
          gsap.ticker.add(drift);
          return () => gsap.ticker.remove(drift);
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} data-intro="pending" className="group/intro flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
      <noscript>
        <style>{`[data-intro-hero],[data-intro-pillar],[data-intro-step]{visibility:visible!important;opacity:1!important}`}</style>
      </noscript>

      {/* O bloco da marca absorve o espaço livre (flex-1) e as medidas acompanham a altura da tela */}
      <div
        data-intro-hero
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(8px,1.8dvh,20px)] text-center group-data-[intro=pending]/intro:invisible lg:items-start lg:text-left"
      >
        <div data-intro-key className="relative">
          {/* A única luz da tela: um halo atrás da fechadura */}
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 size-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.75),rgb(220_211_243/0.35)_55%,transparent)]"
          />
          {/* Fechadura em vidro: arco no topo, base reta — a única superfície de vidro da tela */}
          <div
            data-intro-keyhole
            className="relative overflow-hidden rounded-t-full rounded-b-[26%] border border-white/70 bg-white/45 px-[clamp(14px,3dvh,30px)] pt-[clamp(14px,3dvh,30px)] pb-[clamp(10px,2.2dvh,22px)] shadow-[0_18px_40px_-20px_rgb(24_47_88/0.35)] backdrop-blur-[14px] lg:px-10 lg:pt-10 lg:pb-7"
          >
            <KeyMark className="relative h-[clamp(48px,10.4dvh,108px)] w-auto lg:h-[150px]" />
            {/* Varredura de luz: passa uma vez ao carregar */}
            <span
              data-intro-sweep
              aria-hidden
              className="pointer-events-none absolute inset-y-[-20%] left-0 w-[45%] -translate-x-[220%] skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.85),transparent)]"
            />
          </div>
        </div>
        <h1 className="flex flex-col items-center gap-[0.08em] text-[clamp(30px,6.2dvh,56px)] text-ink lg:mt-2 lg:flex-row lg:items-start lg:gap-[0.3em] lg:text-[72px]" aria-label="CLAVIS VIA">
          {/* padding-left compensa o letter-spacing depois da última letra e centraliza a palavra */}
          <span data-intro-wordmark className="type-display pl-[0.14em] leading-none font-semibold tracking-[0.14em]">
            CLAVIS
          </span>
          <span data-intro-wordmark className="type-display pl-[0.14em] leading-none font-semibold tracking-[0.14em]">
            VIA
          </span>
        </h1>
        <p
          data-intro-tagline
          className="type-quote max-w-[22ch] text-[clamp(17px,3dvh,24px)] text-text-soft lg:text-[28px]"
        >
          Seu caminho de volta para si, todos os dias.
        </p>
      </div>

      <div className="contents lg:flex lg:flex-col lg:gap-8 lg:rounded-[32px] lg:border lg:border-white/70 lg:bg-white/50 lg:p-9 lg:shadow-[0_24px_60px_-30px_rgb(24_47_88/0.35)] lg:backdrop-blur-md">
        <ul className="mt-[clamp(12px,3dvh,36px)] grid grid-cols-3 gap-2 group-data-[intro=pending]/intro:invisible lg:mt-0 lg:grid-cols-1 lg:gap-4">
          {pillars}
        </ul>

        <div className="mt-[clamp(14px,3dvh,36px)] flex flex-col group-data-[intro=pending]/intro:invisible lg:mt-0">{children}</div>
      </div>
    </div>
  );
}
