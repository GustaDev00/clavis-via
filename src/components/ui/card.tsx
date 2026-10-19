import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-white/70 bg-surface/80 shadow-soft backdrop-blur-md", className)}
      {...props}
    />
  );
}

/** Selo discreto que identifica conteúdo fictício. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-lav-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-lav-700",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-lav-500" aria-hidden />
      Conteúdo de demonstração
    </span>
  );
}
