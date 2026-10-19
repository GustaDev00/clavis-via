"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Erro inesperado ao carregar uma tela: explica com calma e oferece tentar de novo. */
export default function AppError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Reveal className="pt-8">
      <Card className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <p className="eyebrow text-rose-700">Algo saiu do lugar</p>
          <h1 className="type-display text-[32px] text-ink">Não conseguimos carregar esta tela.</h1>
          <p className="text-[15px] leading-6 text-text-soft">
            Pode ter sido uma instabilidade de conexão. Seus registros continuam salvos.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => retry()}>
            <RefreshCw className="size-4" aria-hidden />
            Tentar novamente
          </Button>
          <ButtonLink href="/hoje" variant="ghost" size="lg">
            Voltar para Hoje
          </ButtonLink>
        </div>
        {error.digest ? <p className="text-xs text-muted">Código do erro: {error.digest}</p> : null}
      </Card>
    </Reveal>
  );
}
