import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "soft" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group/button relative inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-semibold tracking-[-0.01em] " +
  "duration-[var(--dur-micro)] ease-out-soft active:scale-[0.97] active:duration-[var(--dur-press)] " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white shadow-soft hover:-translate-y-px hover:bg-navy-hover hover:shadow-lift active:translate-y-0 active:bg-navy-pressed",
  soft: "bg-sky-100 text-ink hover:-translate-y-px hover:bg-sky-200 active:translate-y-0",
  outline:
    "border border-line bg-surface/80 text-ink backdrop-blur hover:-translate-y-px hover:border-lav-300 hover:shadow-soft active:translate-y-0",
  ghost: "text-ink hover:bg-navy-50",
  danger: "bg-error-bg text-error hover:-translate-y-px hover:bg-rose-200 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 w-full px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Mostra o estado "enviando" sem mudar a largura do botão */
  pending?: boolean;
  pendingLabel?: string;
};

export function Button({
  variant,
  size,
  className,
  pending = false,
  pendingLabel = "Enviando…",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      aria-busy={pending || undefined}
      aria-disabled={pending || undefined}
      {...props}
    >
      <PendingStack pending={pending} pendingLabel={pendingLabel}>
        {children}
      </PendingStack>
    </button>
  );
}

/** Rótulo e indicador empilhados na mesma célula do grid: a troca é um crossfade, sem salto. */
function PendingStack({ pending, pendingLabel, children }: { pending: boolean; pendingLabel: string; children: ReactNode }) {
  return (
    <span className="grid items-center justify-items-center [grid-template-areas:'stack']">
      <span
        className={cn(
          "inline-flex items-center gap-2 transition-[opacity,translate] duration-[var(--dur-meso)] ease-out-soft [grid-area:stack]",
          pending && "-translate-y-1 opacity-0",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden={!pending}
        className={cn(
          "inline-flex items-center gap-1.5 transition-[opacity,translate] duration-[var(--dur-meso)] ease-out-soft [grid-area:stack]",
          pending ? "opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <span className="sr-only">{pendingLabel}</span>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 rounded-full bg-current motion-safe:animate-[cv-dot_1s_var(--ease-in-out-sine)_infinite]"
            style={{ animationDelay: `${dot * 0.14}s` }}
          />
        ))}
      </span>
    </span>
  );
}

type ButtonLinkProps<Route extends string> = LinkProps<Route> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink<Route extends string>({ variant, size, className, ...props }: ButtonLinkProps<Route>) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
