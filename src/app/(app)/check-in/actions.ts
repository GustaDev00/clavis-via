"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { checkInSchema, toFieldErrors } from "@/lib/domain/validation";
import { errorState, GENERIC_ERROR, logActionError, SESSION_ERROR, type FormState } from "@/lib/actions/state";

export type CheckInField = "emotion" | "note";

export async function saveCheckIn(
  previous: FormState<CheckInField>,
  formData: FormData,
): Promise<FormState<CheckInField>> {
  const viewer = await getViewer();
  if (!viewer) return errorState(previous, { message: SESSION_ERROR });

  const parsed = checkInSchema.safeParse({
    emotion: formData.get("emotion") ?? undefined,
    note: formData.get("note"),
  });
  if (!parsed.success) {
    return errorState(previous, { fieldErrors: toFieldErrors<CheckInField>(parsed.error) });
  }

  const supabase = await createClient();
  // user_id e created_at vêm dos defaults do banco (auth.uid(), now())
  const { error } = await supabase.from("check_ins").insert(parsed.data);

  if (error) {
    logActionError("[saveCheckIn]", error);
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect("/hoje?salvo=check-in");
}
