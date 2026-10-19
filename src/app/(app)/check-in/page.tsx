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
      <section className="flex flex-col gap-7 pt-2">
        <header className="flex flex-col gap-3">
          <Reveal>
            <p className="eyebrow text-lav-700">Check-in de hoje</p>
          </Reveal>
          <RevealHeading id="check-in-heading" className="type-display text-[40px] text-ink">
            Como você está chegando hoje?
          </RevealHeading>
          <Reveal delay={0.3}>
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
