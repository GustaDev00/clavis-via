/**
 * Névoa pastel ao fundo, com deriva lenta (18–26s, curva senoidal).
 * Só CSS: não depende de hidratação e para no modo de movimento reduzido.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[20%] -left-[25%] size-[70vmax] rounded-full bg-sky-200/55 blur-[90px] motion-safe:animate-drift" />
      <div className="absolute top-[25%] -right-[30%] size-[60vmax] rounded-full bg-rose-200/45 blur-[90px] motion-safe:animate-drift-slow" />
      <div className="absolute -bottom-[25%] left-[5%] size-[65vmax] rounded-full bg-lav-200/50 blur-[100px] motion-safe:animate-drift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(247_248_252/0.6)_100%)]" />
    </div>
  );
}
