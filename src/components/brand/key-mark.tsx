import type { SVGProps } from "react";

/**
 * Símbolo da marca: uma chave com cabeça em trevo (três anéis), como na referência visual.
 * Feito só com traços para poder ser "desenhado" pela animação (DrawSVG).
 */
export function KeyMark({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 64 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="key-mark-gradient" x1="0" y1="0" x2="64" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8e7fd0" />
          <stop offset="0.55" stopColor="#7fa3d9" />
          <stop offset="1" stopColor="#c6b9ec" />
        </linearGradient>
      </defs>
      <g stroke="url(#key-mark-gradient)">
        <circle data-key-part cx="32" cy="17" r="11" />
        <circle data-key-part cx="20" cy="36" r="11" />
        <circle data-key-part cx="44" cy="36" r="11" />
        <path data-key-part d="M32 46 V110" />
        <path data-key-part d="M32 78 H44" />
        <path data-key-part d="M32 92 H48" />
        <path data-key-part d="M32 104 H42" />
      </g>
    </svg>
  );
}
