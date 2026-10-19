"use client";

import { MotionConfig } from "motion/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { ReactNode } from "react";

// Registro único dos plugins do GSAP e das curvas nomeadas (mesmos valores de lib/motion.ts)
gsap.registerPlugin(useGSAP, CustomEase, DrawSVGPlugin, SplitText);
CustomEase.create("cv.outSoft", "0.22,1,0.36,1");
CustomEase.create("cv.inOutSoft", "0.4,0,0.1,1");
gsap.defaults({ ease: "cv.outSoft", duration: 0.32 });

/**
 * `reducedMotion="user"`: com "reduzir movimento" ativo no sistema, o Motion
 * desliga deslocamentos e mantém só opacidade/cor — as transições continuam suaves.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
