"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { IDLE } from "@/lib/actions/state";
import { completePractice } from "../../actions";

export function CompletePracticeForm({
  practiceSlug,
  checkInId,
  doneToday,
}: {
  practiceSlug: string;
  checkInId: string | null;
  doneToday: boolean;
}) {
  const [state, formAction, pending] = useActionState(completePractice, IDLE);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="practiceSlug" value={practiceSlug} />
      <input type="hidden" name="checkInId" value={checkInId ?? ""} />
      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />
      <Button type="submit" size="lg" pending={pending} pendingLabel="Registrando prática…" className="shadow-float">
        <Check className="size-4" aria-hidden />
        {doneToday ? "Registrar de novo" : "Concluí esta prática"}
      </Button>
      {doneToday ? (
        <p className="text-center text-xs text-muted">Você já registrou esta prática hoje. Pode repetir quando quiser.</p>
      ) : null}
    </form>
  );
}
