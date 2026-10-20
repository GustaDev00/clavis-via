"use client";

import { createContext, use, useEffect, useMemo, useRef, type ReactNode } from "react";
import { AuroraCanvas } from "./aurora-canvas";
import type { AmbientTone } from "./palettes";

type AmbientApi = {
  /** Muda a cor do fundo (transição suave de ~1s) */
  setTone: (tone: AmbientTone) => void;
  /** 0–1: intensidade da "respiração" do fundo (usada na prática guiada) */
  setBreath: (value: number) => void;
};

const AmbientContext = createContext<AmbientApi | null>(null);

/**
 * Fundo vivo do app. Estado em refs (não em state): mudar a cor ou a respiração
 * não re-renderiza a árvore React; o loop do canvas lê os valores a cada quadro.
 */
export function AmbientProvider({ children }: { children: ReactNode }) {
  const toneRef = useRef<AmbientTone>("brand");
  const breathRef = useRef(0);

  const api = useMemo<AmbientApi>(
    () => ({
      setTone: (tone) => {
        toneRef.current = tone;
      },
      setBreath: (value) => {
        breathRef.current = Math.max(0, Math.min(1, value));
      },
    }),
    [],
  );

  return (
    <AmbientContext value={api}>
      <AuroraCanvas toneRef={toneRef} breathRef={breathRef} />
      {children}
    </AmbientContext>
  );
}

export function useAmbient(): AmbientApi {
  const api = use(AmbientContext);
  if (!api) throw new Error("useAmbient precisa estar dentro de <AmbientProvider>");
  return api;
}

/** Define o tom do fundo enquanto a tela estiver montada (volta ao tom da marca ao sair). */
export function AmbientTone({ tone }: { tone: AmbientTone }) {
  const { setTone } = useAmbient();
  useEffect(() => {
    setTone(tone);
    return () => setTone("brand");
  }, [tone, setTone]);
  return null;
}

