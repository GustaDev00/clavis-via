import { RevealOut } from "@/components/motion/page-transition";

/** Esqueleto genérico das telas: sai rápido quando o conteúdo chega. */
export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <RevealOut>
      <div className="flex flex-col gap-5 pt-2" aria-busy="true" aria-label="Carregando">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-10 w-4/5" />
        <div className="skeleton h-4 w-3/5" />
        {Array.from({ length: cards }, (_, index) => (
          <div key={index} className="skeleton h-36 w-full rounded-card" />
        ))}
      </div>
    </RevealOut>
  );
}
