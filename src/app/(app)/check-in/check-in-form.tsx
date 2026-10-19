"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useId, useState, type SubmitEvent } from "react";
import { EmotionPicker } from "@/components/emotions/emotion-picker";
import { Button } from "@/components/ui/button";
import { TextAreaField } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { IDLE, type FormState } from "@/lib/actions/state";
import type { Emotion } from "@/lib/domain/emotions";
import { checkInSchema, LIMITS, toFieldErrors, type FieldErrors } from "@/lib/domain/validation";
import { DUR, EASE } from "@/lib/motion";
import { saveCheckIn, type CheckInField } from "./actions";

export function CheckInForm({ headingId }: { headingId: string }) {
  const [state, formAction, pending] = useActionState(saveCheckIn, IDLE as FormState<CheckInField>);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [note, setNote] = useState("");
  const [localErrors, setLocalErrors] = useState<FieldErrors<CheckInField>>({});
  const [attempt, setAttempt] = useState(0);
  const errorId = useId();

  const serverErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const errors: FieldErrors<CheckInField> = { ...serverErrors, ...localErrors };
  const errorKey = attempt + (state.status === "error" ? state.attempt : 0);
  const isOther = emotion === "outro";

  // Mesma regra da Server Action, para feedback imediato (o servidor valida de novo)
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const parsed = checkInSchema.safeParse({ emotion: emotion ?? undefined, note });
    if (!parsed.success) {
      event.preventDefault();
      setLocalErrors(toFieldErrors<CheckInField>(parsed.error));
      setAttempt((value) => value + 1);
    }
  }

  function clearError(field: CheckInField) {
    setLocalErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="emotion" value={emotion ?? ""} />

      <div className="flex flex-col gap-2">
        <EmotionPicker
          value={emotion}
          onChange={(next) => {
            setEmotion(next);
            clearError("emotion");
            if (next !== "outro") clearError("note");
          }}
          invalid={Boolean(errors.emotion)}
          describedBy={errorId}
          labelledBy={headingId}
        />
        <div id={errorId} aria-live="polite" className="min-h-5 px-1 text-[13px] leading-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {errors.emotion ? (
              <motion.p
                key={`emotion-error-${errorKey}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, x: [0, -3, 3, -2, 0] }}
                exit={{ opacity: 0, transition: { duration: 0.16 } }}
                transition={{ duration: 0.32, ease: EASE.outSoft }}
                className="font-medium text-error"
              >
                {errors.emotion}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <motion.div layout transition={{ duration: DUR.meso, ease: EASE.outSoft }}>
        <TextAreaField
          name="note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            clearError("note");
          }}
          maxLength={LIMITS.checkInNote}
          rows={3}
          label={
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOther ? "other" : "optional"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE.outSoft }}
                className="inline-block"
              >
                {isOther ? (
                  "Conte em poucas palavras o que você está sentindo"
                ) : (
                  <>
                    Quer contar um pouco mais? <span className="font-normal text-muted">(opcional)</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          }
          placeholder={isOther ? "Ex.: saudade, um misto de coisas…" : "O que trouxe você até aqui hoje…"}
          hint="Só você vê o que escrever aqui."
          error={errors.note}
          errorKey={errorKey}
          aria-required={isOther || undefined}
        />
      </motion.div>

      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />

      <div className="sticky bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom)+12px)] z-10">
        <Button type="submit" size="lg" pending={pending} pendingLabel="Salvando seu check-in…" className="shadow-float">
          Salvar check-in
        </Button>
      </div>
    </form>
  );
}
