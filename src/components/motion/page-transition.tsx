import { ViewTransition, type ReactNode } from "react";

const NAVIGATION = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  "nav-tab": "nav-tab",
  default: "nav-fade",
} as const;

/**
 * Envolve o conteúdo de cada página: a navegação (que no App Router é uma Transition)
 * anima a saída da página antiga e a entrada da nova conforme o tipo do link
 * (avançar, voltar, trocar de aba). Sem tipo (redirect após salvar, voltar do navegador): crossfade.
 * Navegadores sem View Transitions simplesmente trocam a página.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={NAVIGATION} exit={NAVIGATION} default="none">
      {children}
    </ViewTransition>
  );
}

/** Revelação do conteúdo que chega depois do esqueleto (Suspense). */
export function RevealIn({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="reveal-in" default="none">
      {children}
    </ViewTransition>
  );
}

export function RevealOut({ children }: { children: ReactNode }) {
  return (
    <ViewTransition exit="reveal-out" default="none">
      {children}
    </ViewTransition>
  );
}
