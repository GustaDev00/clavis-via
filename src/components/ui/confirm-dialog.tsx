"use client";

import { useActionState, useRef, type ReactNode } from "react";
import { Button, buttonClasses } from "./button";
import { FormMessage } from "./form-message";
import { IDLE, type FormState } from "@/lib/actions/state";

type Props = {
  triggerLabel: ReactNode;
  triggerClassName?: string;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  action: (previous: FormState) => Promise<FormState>;
  tone?: "danger" | "primary";
};

/**
 * Confirmação para ações irreversíveis. Usa o <dialog> nativo (foco preso, Esc fecha)
 * com entrada/saída animadas em CSS (@starting-style).
 */
export function ConfirmDialog({ triggerLabel, triggerClassName, title, description, confirmLabel, pendingLabel, action, tone = "danger" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(action, IDLE);
  const titleId = `${confirmLabel.replace(/\s+/g, "-").toLowerCase()}-title`;

  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? buttonClasses({ variant: "outline", size: "lg" })}
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="cv-dialog m-auto w-[calc(100%-40px)] max-w-sm rounded-sheet border border-white/70 bg-surface p-6 text-text shadow-float"
        onClick={(event) => {
          // Clique fora do conteúdo (no backdrop) fecha
          if (event.target === dialogRef.current && !pending) dialogRef.current?.close();
        }}
      >
        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="type-display text-[28px] text-ink">
              {title}
            </h2>
            <div className="text-[15px] leading-6 text-text-soft">{description}</div>
          </div>

          <FormMessage
            message={state.status === "error" ? state.message : undefined}
            attempt={state.status === "error" ? state.attempt : 0}
          />

          <div className="flex flex-col gap-2">
            <Button type="submit" variant={tone} size="lg" pending={pending} pendingLabel={pendingLabel}>
              {confirmLabel}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              disabled={pending}
              onClick={() => dialogRef.current?.close()}
              autoFocus
            >
              Cancelar
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
