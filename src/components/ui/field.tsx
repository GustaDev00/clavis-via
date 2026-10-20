"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { DUR, EASE, SPRING } from "@/lib/motion";

type ShellProps = {
  label: ReactNode;
  /** Mantém o rótulo só para leitores de tela (quando o contexto já deixa claro o que é o campo) */
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Muda a cada envio com erro: reanima a mensagem mesmo que o texto seja o mesmo */
  errorKey?: number | string;
  count?: { value: number; max: number };
  children: (ids: { inputId: string; describedBy: string }) => ReactNode;
};

/**
 * Estrutura comum de campos: rótulo, controle e uma linha de ajuda/erro com espaço reservado.
 * A ajuda faz crossfade para o erro (sem empurrar o layout) e o erro é anunciado por aria-live.
 */
function FieldShell({ label, hideLabel, hint, error, errorKey, count, children }: ShellProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const nearLimit = count ? count.value >= count.max * 0.9 : false;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className={cn("text-sm font-semibold text-ink", hideLabel && "sr-only")}>
        {label}
      </label>

      <motion.div
        key={error ? `error-${errorKey}` : "ok"}
        animate={error ? { x: [0, -3, 3, -2, 0] } : { x: 0 }}
        transition={{ duration: DUR.meso, ease: EASE.outSoft }}
      >
        {children({ inputId, describedBy: messageId })}
      </motion.div>

      <div className="flex min-h-5 items-start justify-between gap-3 text-[13px] leading-5">
        <div id={messageId} aria-live="polite" className="relative flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {error ? (
              <motion.p
                key={`error-${errorKey}-${error}`}
                className="flex items-start gap-1.5 font-medium text-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.16 } }}
                transition={{ duration: 0.24, ease: EASE.outSoft }}
              >
                <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={SPRING.pop} className="mt-0.5">
                  <CircleAlert className="size-4" aria-hidden />
                </motion.span>
                <span>{error}</span>
              </motion.p>
            ) : hint ? (
              <motion.p
                key="hint"
                className="text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.16 } }}
                transition={{ duration: 0.24, ease: EASE.outSoft }}
              >
                {hint}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {count ? (
          <span
            aria-live="polite"
            aria-label={`${count.value} de ${count.max} caracteres`}
            className={cn(
              "tabular shrink-0 font-medium text-muted transition-colors duration-[var(--dur-meso)]",
              nearLimit && "text-rose-700",
            )}
          >
            {count.value}/{count.max}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const controlClasses =
  "w-full rounded-input border bg-sunken px-4 text-[16px] text-text placeholder:text-placeholder " +
  "outline-none duration-[var(--dur-meso)] ease-out-soft " +
  "hover:border-lav-500 focus:border-navy focus:bg-surface focus:shadow-[0_0_0_4px_rgb(91_116_201/0.22)] " +
  "aria-invalid:border-error-line aria-invalid:bg-error-bg/40 aria-invalid:focus:shadow-[0_0_0_4px_rgb(201_80_108/0.18)]";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  errorKey?: number | string;
  showCount?: boolean;
};

export function TextField({ label, hint, error, errorKey, showCount, className, ...props }: TextFieldProps) {
  const length = typeof props.value === "string" ? props.value.length : 0;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      errorKey={errorKey}
      count={showCount && props.maxLength ? { value: length, max: props.maxLength } : undefined}
    >
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(controlClasses, "h-14 border-line-strong/50", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: string;
  errorKey?: number | string;
};

export function TextAreaField({ label, hideLabel, hint, error, errorKey, className, ...props }: TextAreaFieldProps) {
  const length = typeof props.value === "string" ? props.value.length : 0;
  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      errorKey={errorKey}
      count={props.maxLength ? { value: length, max: props.maxLength } : undefined}
    >
      {({ inputId, describedBy }) => (
        <textarea
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClasses,
            "field-sizing-content min-h-28 resize-none border-line-strong/50 py-3.5 leading-6 [overflow-wrap:anywhere]",
            className,
          )}
          {...props}
        />
      )}
    </FieldShell>
  );
}
