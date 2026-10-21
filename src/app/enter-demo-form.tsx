"use client";

import { useActionState, useState, type SubmitEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { IDLE, type FormState } from "@/lib/actions/state";
import { enterDemoSchema, LIMITS, toFieldErrors, type FieldErrors } from "@/lib/domain/validation";
import { enterDemo, type EnterDemoField } from "./actions";

export function EnterDemoForm() {
  const [state, formAction, pending] = useActionState(enterDemo, IDLE as FormState<EnterDemoField>);
  const [displayName, setDisplayName] = useState("");
  const [localErrors, setLocalErrors] = useState<FieldErrors<EnterDemoField>>({});
  const [attempt, setAttempt] = useState(0);

  const serverErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const error = localErrors.displayName ?? serverErrors.displayName;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const parsed = enterDemoSchema.safeParse({ displayName });
    if (!parsed.success) {
      event.preventDefault();
      setLocalErrors(toFieldErrors<EnterDemoField>(parsed.error));
      setAttempt((value) => value + 1);
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[clamp(8px,1.6dvh,16px)]">
      <div data-intro-step>
        <TextField
          name="displayName"
          label="Como podemos te chamar?"
          placeholder="Seu nome ou apelido (opcional)"
          autoComplete="nickname"
          // Deixa digitar além do limite de propósito: a mensagem de erro é parte da experiência testada
          maxLength={LIMITS.displayName + 20}
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
            setLocalErrors({});
          }}
          hint={
            <>
              Sem cadastro. <span className="xshort:hidden">Os dados ficam salvos por 30 dias e podem ser apagados em Jornada.</span>
            </>
          }
          error={error}
          errorKey={attempt + (state.status === "error" ? state.attempt : 0)}
          className="h-[clamp(48px,7dvh,56px)]"
        />
      </div>

      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />

      <div data-intro-step>
        <Button
          type="submit"
          size="lg"
          pending={pending}
          pendingLabel="Preparando sua demonstração…"
          className="h-[clamp(48px,7dvh,56px)]"
        >
          Entrar como visitante demo
          <ArrowRight className="size-4 transition-transform duration-[var(--dur-micro)] group-hover/button:translate-x-0.5" aria-hidden />
        </Button>
      </div>

    </form>
  );
}
