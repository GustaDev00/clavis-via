import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "./viewer";

export type PracticeCompletion = {
  id: string;
  completed_at: string;
  check_in_id: string | null;
  practice: { slug: string; title: string; kind: string } | null;
};

/** Total de práticas concluídas pelo usuário (sem carregar as linhas). */
export const countPracticeCompletions = cache(async (): Promise<number> => {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("practice_completions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", viewer.id);
  if (error) throw new Error("Não foi possível contar suas práticas.", { cause: error });
  return count ?? 0;
});

export const getRecentPracticeCompletions = cache(async (limit = 10): Promise<PracticeCompletion[]> => {
  const viewer = await requireViewer();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("practice_completions")
    .select("id, completed_at, check_in_id, practice:practices(slug, title, kind)")
    .eq("user_id", viewer.id)
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Não foi possível carregar suas práticas.", { cause: error });
  return data;
});
