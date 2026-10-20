/**
 * Fundo de reserva em CSS, pintado já no servidor: as mesmas cores da aurora, em gradientes
 * radiais estáticos. Fica visível até o canvas WebGL entrar (e permanece se ele não existir).
 * Sem filter: blur() — o desfoque dos gradientes já é natural e não custa repaint.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(60%_42%_at_18%_12%,#e3ecf8,transparent_70%),radial-gradient(55%_40%_at_88%_28%,#ece7f8,transparent_70%),radial-gradient(75%_45%_at_50%_105%,#fbe6ec,transparent_70%),#f7f8fc]"
    />
  );
}
