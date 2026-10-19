import Link, { type LinkProps } from "next/link";
import { ArrowLeft } from "lucide-react";

/** Voltar na hierarquia: anima a página deslizando para a direita (nav-back). */
export function BackLink<Route extends string>({ href, label }: { href: LinkProps<Route>["href"]; label: string }) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-back"]}
      className="group inline-flex h-10 items-center gap-2 self-start rounded-full pr-3 pl-1 text-sm font-semibold text-text-soft hover:text-ink"
    >
      <span className="grid size-9 place-items-center rounded-full bg-surface/80 shadow-soft group-hover:-translate-x-0.5 group-hover:shadow-lift">
        <ArrowLeft className="size-4" aria-hidden />
      </span>
      {label}
    </Link>
  );
}
