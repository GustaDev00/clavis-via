import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[var(--app-max)] flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-[image:var(--grad-aurora)] text-lav-700 shadow-soft">
        <Compass className="size-7" aria-hidden />
      </span>
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-lav-700">Página não encontrada</p>
        <h1 className="type-display text-[36px] text-ink">Este caminho não existe por aqui.</h1>
        <p className="text-[15px] leading-6 text-text-soft">O endereço pode ter mudado. Vamos voltar para um lugar conhecido.</p>
      </div>
      <ButtonLink href="/hoje" size="lg">
        Voltar para Hoje
      </ButtonLink>
    </main>
  );
}
