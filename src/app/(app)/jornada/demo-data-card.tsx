import { LogOut, RotateCcw, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { buttonClasses } from "@/components/ui/button";
import { signOut } from "@/app/actions";
import { resetDemo } from "./actions";

/** Transparência sobre os dados da demonstração + controles para apagar e sair. */
export function DemoDataCard() {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-ink">Seus dados nesta demonstração</h2>
          <p className="text-sm leading-5 text-text-soft">
            Você entrou como visitante anônimo. Seus registros ficam salvos no banco e só esta sessão consegue
            acessá-los. Use apenas informações fictícias.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <ConfirmDialog
          triggerLabel={
            <>
              <RotateCcw className="size-4" aria-hidden /> Reiniciar demo
            </>
          }
          triggerClassName={buttonClasses({ variant: "outline", size: "md", className: "w-full" })}
          title="Reiniciar a demonstração?"
          description="Seus check-ins, práticas e progresso nos planos serão apagados. Você continua na mesma sessão."
          confirmLabel="Apagar meus registros"
          pendingLabel="Apagando registros…"
          action={resetDemo}
        />
        <ConfirmDialog
          triggerLabel={
            <>
              <LogOut className="size-4" aria-hidden /> Sair
            </>
          }
          triggerClassName={buttonClasses({ variant: "ghost", size: "md", className: "w-full" })}
          title="Sair da demonstração?"
          description="Como você entrou sem cadastro, não será possível voltar a esta mesma jornada depois de sair."
          confirmLabel="Sair mesmo assim"
          pendingLabel="Saindo…"
          action={signOut}
          tone="primary"
        />
      </div>
    </Card>
  );
}
