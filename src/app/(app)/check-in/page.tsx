import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { FlashToast } from "@/components/ui/flash-toast";
import { requireViewer } from "@/lib/dal/viewer";
import { CheckInForm } from "./check-in-form";

export const metadata: Metadata = { title: "Check-in" };

export default async function CheckInPage({ searchParams }: PageProps<"/check-in">) {
  await requireViewer();
  const { reiniciado } = await searchParams;
  const flash = reiniciado ? "Demonstração reiniciada. Seus registros foram apagados." : null;

  return (
    <PageTransition>
      {/* Ocupa a altura visível: a grade de emoções preenche o espaço que sobrar */}
      <section className="screen-fit gap-[clamp(10px,2dvh,24px)] pt-[clamp(2px,1dvh,10px)] md:mx-auto md:w-full md:max-w-[720px] md:gap-8 lg:max-w-[860px]">
        <header className="flex flex-col gap-[clamp(4px,1dvh,12px)]">
          {/* Eyebrow e subtítulo saem quando a nota abre (o formulário marca data-note="open") */}
          <Reveal className="short:hidden [section:has([data-note=open])_&]:hidden">
            <p className="eyebrow text-lav-700">Check-in de hoje</p>
          </Reveal>
          <RevealHeading id="check-in-heading" className="type-display text-[clamp(26px,5dvh,40px)] text-ink lg:text-[52px]">
            Como você está chegando hoje?
          </RevealHeading>
          <Reveal delay={0.3} className="short:hidden [section:has([data-note=open])_&]:hidden">
            <p className="text-[15px] leading-6 text-text-soft">
              Escolha o que mais representa o seu momento agora. Não existe resposta certa.
            </p>
          </Reveal>
        </header>

        <CheckInForm headingId="check-in-heading" />
      </section>
      <FlashToast key={flash ?? "none"} message={flash} />
    </PageTransition>
  );
}
