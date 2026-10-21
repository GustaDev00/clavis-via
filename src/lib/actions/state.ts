import type { FieldErrors } from "@/lib/domain/validation";

/** Estado devolvido pelas Server Actions para os formulários (useActionState). */
export type FormState<Field extends string = string> =
  | { status: "idle" }
  | {
      status: "error";
      /** Mensagem geral (falha de rede, banco, sessão) */
      message?: string;
      fieldErrors?: FieldErrors<Field>;
      /** Incrementa a cada envio com erro para reanimar a mensagem mesmo que o texto seja igual */
      attempt: number;
    };

export const IDLE: FormState = { status: "idle" };

export function errorState<Field extends string>(
  previous: FormState<Field>,
  error: { message?: string; fieldErrors?: FieldErrors<Field> },
): FormState<Field> {
  return {
    status: "error",
    ...error,
    attempt: previous.status === "error" ? previous.attempt + 1 : 1,
  };
}

/** Log técnico sem dados do usuário: só código e mensagem do erro (nunca `details`/`hint`). */
export function logActionError(tag: string, error: { code?: string | null; message?: string } | null | undefined) {
  console.error(tag, { code: error?.code ?? null, message: error?.message ?? "erro desconhecido" });
}

export const GENERIC_ERROR = "Algo não saiu como esperado. Tente novamente em instantes.";
export const SESSION_ERROR = "Sua sessão de demonstração expirou. Volte à entrada para começar de novo.";
