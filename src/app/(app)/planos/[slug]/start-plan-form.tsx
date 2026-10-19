"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { IDLE } from "@/lib/actions/state";
import { startPlan } from "../actions";

export function StartPlanForm({ planSlug }: { planSlug: string }) {
  const [state, formAction, pending] = useActionState(startPlan, IDLE);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="planSlug" value={planSlug} />
      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />
      <Button type="submit" size="lg" pending={pending} pendingLabel="Abrindo o plano…" className="shadow-float">
        Começar plano
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
