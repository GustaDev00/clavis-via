"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Ao navegar para uma nova tela (link ou redirect após salvar), começa do topo.
 * Voltar/avançar do navegador mantém a posição que o próprio navegador restaura.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
