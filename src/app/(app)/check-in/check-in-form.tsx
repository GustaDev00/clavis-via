"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useId, useRef, useState, type SubmitEvent } from "react";
import { Plus } from "lucide-react";
import { EmotionPicker } from "@/components/emotions/emotion-picker";
import { Button } from "@/components/ui/button";
import { TextAreaField } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { IDLE, type FormState } from "@/lib/actions/state";
import type { Emotion } from "@/lib/domain/emotions";
import { checkInSchema, LIMITS, toFieldErrors, type FieldErrors } from "@/lib/domain/validation";
import { DUR, EASE } from "@/lib/motion";
import { saveCheckIn, type CheckInField } from "./actions";

/**
 * Formulário em coluna flexível: a grade de emoções ocupa o espaço livre da tela
 * e a nota opcional fica recolhida até a pessoa pedir (ou escolher "Outro", que exige descrição).
 */
export function CheckInForm({ headingId }: { headingId: string }) {
  const [state, formAction, pending] = useActionState(saveCheckIn, IDLE as FormState<CheckInField>);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [note, setNote] = useState("");
  const [noteRequested, setNoteRequested] = useState(false);
  const [localErrors, setLocalErrors] = useState<FieldErrors<CheckInField>>({});
  const [attempt, setAttempt] = useState(0);
  const errorId = useId();
  const noteRef = useRef<HTMLDivElement>(null);

  const serverErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const errors: FieldErrors<CheckInField> = { ...serverErrors, ...localErrors };
  const errorKey = attempt + (state.status === "error" ? state.attempt : 0);
  const isOther = emotion === "outro";
  const noteOpen = noteRequested || isOther || note.length > 0 || Boolean(errors.note);

  // Ao abrir a nota pelo botão, foca o campo e garante que ele fique visível acima do teclado
  useEffect(() => {
    if (!noteRequested) return;
    const textarea = noteRef.current?.querySelector("textarea");
    textarea?.focus({ preventScroll: true });
    noteRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [noteRequested]);

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
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      // Com a nota aberta, a grade de emoções encolhe (ver EmotionPicker) para tudo seguir na tela
      data-note={noteOpen ? "open" : "closed"}
      className="group/checkin flex flex-1 flex-col gap-[clamp(6px,1.4dvh,14px)]"
    >
      <input type="hidden" name="emotion" value={emotion ?? ""} />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-1 flex-col justify-center">
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
        </div>
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

      <AnimatePresence initial={false} mode="popLayout">
        {noteOpen ? (
          <motion.div
            key="note"
            ref={noteRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.meso, ease: EASE.outSoft }}
            className="-mx-1 overflow-hidden px-1 pt-1"
          >
            <TextAreaField
              name="note"
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                clearError("note");
              }}
              maxLength={LIMITS.checkInNote}
              rows={2}
              className="min-h-[clamp(52px,10dvh,112px)]"
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
        ) : (
          <motion.button
            key="add-note"
            type="button"
            onClick={() => setNoteRequested(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.16 } }}
            className="group flex h-11 items-center justify-center gap-2 self-center rounded-full px-4 text-sm font-semibold text-lav-700 hover:bg-lav-100 active:scale-95"
          >
            <Plus className="size-4 transition-transform duration-[var(--dur-meso)] group-hover:rotate-90" aria-hidden />
            Adicionar uma nota <span className="font-normal text-muted">(opcional)</span>
          </motion.button>
        )}
      </AnimatePresence>

      <FormMessage
        message={state.status === "error" ? state.message : undefined}
        attempt={state.status === "error" ? state.attempt : 0}
      />

      <Button
        type="submit"
        size="lg"
        pending={pending}
        pendingLabel="Salvando seu check-in…"
        className="h-[clamp(48px,7dvh,56px)] shrink-0 shadow-lift"
      >
        Salvar check-in
      </Button>
    </form>
  );
}
