"use client";

import { useActionState, useState, type SubmitEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
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
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div data-intro-step>
        <TextField
          name="displayName"
          label="Como podemos te chamar?"
          placeholder="Seu nome ou apelido (opcional)"
          autoComplete="nickname"
          maxLength={LIMITS.displayName + 20}
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
            setLocalErrors({});
          }}
          hint="Sem cadastro: usamos só para te cumprimentar."
          error={error}
          errorKey={attempt + (state.status === "error" ? state.attempt : 0)}
        />
      </div>

      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />

      <div data-intro-step className="flex flex-col gap-3">
        <Button type="submit" size="lg" pending={pending} pendingLabel="Preparando sua demonstração…">
          Entrar como visitante demo
          <ArrowRight className="size-4 transition-transform duration-[var(--dur-micro)] group-hover/button:translate-x-0.5" aria-hidden />
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs leading-5 text-muted">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
          Ambiente de demonstração · use apenas dados fictícios
        </p>
      </div>

      <p data-intro-step className="text-center text-[11px] leading-4 text-muted">
        O CLAVIS VIA não substitui acompanhamento psicológico ou médico. Se precisar de apoio agora, o CVV atende
        24h pelo <strong className="font-semibold text-text-soft">188</strong> ou em cvv.org.br.
      </p>
    </form>
  );
}
