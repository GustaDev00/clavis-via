"use client";

import { useActionState, useState, type SubmitEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextAreaField } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { IDLE, type FormState } from "@/lib/actions/state";
import { LIMITS, reflectionSchema } from "@/lib/domain/validation";
import { completePlanDay, type PlanDayField } from "../../../actions";

export function CompleteDayForm({
  planSlug,
  dayNumber,
  prompt,
}: {
  planSlug: string;
  dayNumber: number;
  prompt: string;
}) {
  const [state, formAction, pending] = useActionState(completePlanDay, IDLE as FormState<PlanDayField>);
  const [reflection, setReflection] = useState("");
  const [localError, setLocalError] = useState<string>();
  const [attempt, setAttempt] = useState(0);

  const error = localError ?? (state.status === "error" ? state.fieldErrors?.reflection : undefined);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const parsed = reflectionSchema.safeParse(reflection);
    if (!parsed.success) {
      event.preventDefault();
      setLocalError(parsed.error.issues[0]?.message);
      setAttempt((value) => value + 1);
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="planSlug" value={planSlug} />
      <input type="hidden" name="dayNumber" value={dayNumber} />

      <TextAreaField
        name="reflection"
        label={
          <>
            {prompt} <span className="font-normal text-muted">(opcional)</span>
          </>
        }
        placeholder="Escreva aqui sua reflexão…"
        value={reflection}
        onChange={(event) => {
          setReflection(event.target.value);
          setLocalError(undefined);
        }}
        maxLength={LIMITS.reflection}
        rows={4}
        hint="Fica guardado na sua jornada. Só você vê."
        error={error}
        errorKey={attempt + (state.status === "error" ? state.attempt : 0)}
      />

      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />

      <Button type="submit" size="lg" pending={pending} pendingLabel="Salvando seu dia…" className="shadow-float">
        <Check className="size-4" aria-hidden />
        Concluir dia {dayNumber}
      </Button>
    </form>
  );
}
