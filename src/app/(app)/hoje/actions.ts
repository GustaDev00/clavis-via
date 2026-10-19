"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { errorState, GENERIC_ERROR, SESSION_ERROR, type FormState } from "@/lib/actions/state";

const completePracticeSchema = z.object({
  practiceSlug: z.string().min(1).max(80),
  checkInId: z.uuid().nullable(),
});

export async function completePractice(previous: FormState, formData: FormData): Promise<FormState> {
  const viewer = await getViewer();
  if (!viewer) return errorState(previous, { message: SESSION_ERROR });

  const parsed = completePracticeSchema.safeParse({
    practiceSlug: formData.get("practiceSlug"),
    checkInId: formData.get("checkInId") || null,
  });
  if (!parsed.success) return errorState(previous, { message: GENERIC_ERROR });

  const supabase = await createClient();
  const { data: practice } = await supabase
    .from("practices")
    .select("id")
    .eq("slug", parsed.data.practiceSlug)
    .maybeSingle();
  if (!practice) return errorState(previous, { message: "Essa prática não está mais disponível." });

  // O RLS também confere que o check-in vinculado pertence a quem está registrando.
  const { error } = await supabase
    .from("practice_completions")
    .insert({ practice_id: practice.id, check_in_id: parsed.data.checkInId });

  if (error) {
    console.error("[completePractice]", error);
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect("/hoje?salvo=pratica");
}
