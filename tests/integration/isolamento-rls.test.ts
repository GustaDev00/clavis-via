/**
 * Testes de isolamento de dados contra o Supabase local (pnpm db:start).
 *
 * Simulam dois visitantes reais (usuários anônimos) e verificam que o banco —
 * não só a interface — impede que um leia ou altere os dados do outro.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/lib/supabase/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

type Client = SupabaseClient<Database>;

function newClient(): Client {
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function newVisitor(name: string): Promise<{ client: Client; userId: string }> {
  const client = newClient();
  const { data, error } = await client.auth.signInAnonymously();
  if (error || !data.user) throw error ?? new Error("sem usuário");
  const profile = await client.from("profiles").insert({ id: data.user.id, display_name: name });
  if (profile.error) throw profile.error;
  return { client, userId: data.user.id };
}

let ana: Awaited<ReturnType<typeof newVisitor>>;
let bruno: Awaited<ReturnType<typeof newVisitor>>;
let anaCheckInId: string;

beforeAll(async () => {
  [ana, bruno] = await Promise.all([newVisitor("Ana"), newVisitor("Bruno")]);
  const { data, error } = await ana.client
    .from("check_ins")
    .insert({ emotion: "ansiedade", note: "nota privada da Ana" })
    .select("id")
    .single();
  if (error) throw error;
  anaCheckInId = data.id;
});

describe("isolamento de check-ins (RLS)", () => {
  it("a dona enxerga o próprio check-in, com user_id preenchido pelo banco", async () => {
    const { data, error } = await ana.client.from("check_ins").select("id, user_id, note");
    expect(error).toBeNull();
    expect(data).toEqual([{ id: anaCheckInId, user_id: ana.userId, note: "nota privada da Ana" }]);
  });

  it("outro visitante não enxerga nada de outra pessoa", async () => {
    const { data, error } = await bruno.client.from("check_ins").select("*");
    expect(error).toBeNull();
    expect(data).toEqual([]);

    const byId = await bruno.client.from("check_ins").select("*").eq("id", anaCheckInId);
    expect(byId.data).toEqual([]);
  });

  it("não é possível criar check-in em nome de outra pessoa", async () => {
    const { error } = await bruno.client
      .from("check_ins")
      .insert({ emotion: "paz", user_id: ana.userId } as never);
    expect(error).not.toBeNull();
    // user_id não é coluna gravável pelo cliente (GRANT por coluna)
    expect(error?.code).toBe("42501");
  });

  it("não é possível apagar o check-in de outra pessoa", async () => {
    const { data } = await bruno.client.from("check_ins").delete().eq("id", anaCheckInId).select();
    expect(data).toEqual([]);

    const stillThere = await ana.client.from("check_ins").select("id").eq("id", anaCheckInId);
    expect(stillThere.data).toHaveLength(1);
  });

  it("check-ins não podem ser editados depois de criados", async () => {
    const { error } = await ana.client.from("check_ins").update({ note: "editado" }).eq("id", anaCheckInId);
    expect(error?.code).toBe("42501");
  });

  it("perfil de outra pessoa é invisível", async () => {
    const { data } = await bruno.client.from("profiles").select("*").eq("id", ana.userId);
    expect(data).toEqual([]);
  });
});

describe("regras de integridade no banco", () => {
  it("'outro' sem descrição é recusado pelo CHECK", async () => {
    const { error } = await ana.client.from("check_ins").insert({ emotion: "outro", note: " " });
    expect(error?.code).toBe("23514");
  });

  it("nota acima de 280 caracteres é recusada pelo CHECK", async () => {
    const { error } = await ana.client.from("check_ins").insert({ emotion: "paz", note: "a".repeat(281) });
    expect(error?.code).toBe("23514");
  });

  it("prática concluída não pode apontar para o check-in de outra pessoa", async () => {
    const { data: practice } = await bruno.client.from("practices").select("id").limit(1).single();
    const { error } = await bruno.client
      .from("practice_completions")
      .insert({ practice_id: practice!.id, check_in_id: anaCheckInId });
    expect(error?.code).toBe("42501"); // violação de política RLS
  });
});

describe("progresso nos planos", () => {
  it("dias são sequenciais e não se repetem", async () => {
    const { data: plan } = await ana.client
      .from("plans")
      .select("id, plan_days(id, day_number)")
      .eq("slug", "voz-e-limites")
      .order("day_number", { referencedTable: "plan_days" })
      .single();
    const [day1, day2] = plan!.plan_days;

    // Sem inscrição: a FK composta impede concluir o dia
    const notEnrolled = await ana.client
      .from("plan_day_completions")
      .insert({ plan_id: plan!.id, plan_day_id: day1.id });
    expect(notEnrolled.error?.code).toBe("23503");

    expect((await ana.client.from("plan_enrollments").insert({ plan_id: plan!.id })).error).toBeNull();

    // Pular para o dia 2 é bloqueado pelo trigger
    const skipped = await ana.client
      .from("plan_day_completions")
      .insert({ plan_id: plan!.id, plan_day_id: day2.id });
    expect(skipped.error?.code).toBe("P0001");
    expect(skipped.error?.hint).toBe("previous_day_required");

    const first = await ana.client
      .from("plan_day_completions")
      .insert({ plan_id: plan!.id, plan_day_id: day1.id, reflection: "Respirei melhor." });
    expect(first.error).toBeNull();

    const duplicate = await ana.client
      .from("plan_day_completions")
      .insert({ plan_id: plan!.id, plan_day_id: day1.id });
    expect(duplicate.error?.code).toBe("23505");

    // O progresso da Ana não aparece para o Bruno
    const brunoView = await bruno.client.from("plan_day_completions").select("*");
    expect(brunoView.data).toEqual([]);
  });

  it("um dia não pode ser associado a outro plano (FK composta)", async () => {
    const { data: plans } = await ana.client
      .from("plans")
      .select("id, slug, plan_days(id, day_number)")
      .order("sort_order")
      .order("day_number", { referencedTable: "plan_days", ascending: false });
    const anxiety = plans!.find((plan) => plan.slug === "quando-a-ansiedade-aperta")!;
    const limits = plans!.find((plan) => plan.slug === "voz-e-limites")!;
    await ana.client.from("plan_enrollments").insert({ plan_id: anxiety.id });

    const { error } = await ana.client
      .from("plan_day_completions")
      .insert({ plan_id: anxiety.id, plan_day_id: limits.plan_days[0].id });
    expect(error?.code).toBe("23503");
  });
});

describe("outras tabelas pessoais e privilégios", () => {
  it("práticas concluídas e inscrições de outra pessoa são invisíveis e intocáveis", async () => {
    const { data: practice } = await ana.client.from("practices").select("id").limit(1).single();
    const { data: planRow } = await ana.client.from("plans").select("id").eq("slug", "recomecar-com-leveza").single();
    expect((await ana.client.from("practice_completions").insert({ practice_id: practice!.id })).error).toBeNull();
    expect((await ana.client.from("plan_enrollments").insert({ plan_id: planRow!.id })).error).toBeNull();

    expect((await bruno.client.from("practice_completions").select("*")).data).toEqual([]);
    expect((await bruno.client.from("plan_enrollments").select("*")).data).toEqual([]);
    expect((await bruno.client.from("plan_enrollments").delete().eq("user_id", ana.userId).select()).data).toEqual([]);
  });

  it("não dá para criar perfil com o id de outra pessoa nem editar o nome alheio", async () => {
    const forged = await bruno.client.from("profiles").insert({ id: ana.userId, display_name: "Impostor" });
    expect(forged.error).not.toBeNull(); // a policy de INSERT exige id = auth.uid()

    const { data } = await bruno.client.from("profiles").update({ display_name: "Hackeada" }).eq("id", ana.userId).select();
    expect(data).toEqual([]);
    const { data: still } = await ana.client.from("profiles").select("display_name").eq("id", ana.userId).single();
    expect(still?.display_name).toBe("Ana");
  });

  it("registros de progresso não são editáveis (sem GRANT de UPDATE)", async () => {
    for (const table of ["practice_completions", "plan_enrollments", "plan_day_completions"] as const) {
      const { error } = await ana.client.from(table).update({ user_id: bruno.userId } as never).eq("user_id", ana.userId);
      expect(error?.code, table).toBe("42501");
    }
  });

  it("nenhuma função de public é chamável pelo papel anônimo da API", async () => {
    const guest = newClient();
    for (const fn of ["delete_my_account", "reset_my_demo"] as const) {
      const { error } = await guest.rpc(fn);
      expect(error, fn).not.toBeNull();
    }
  });
});

describe("reiniciar e apagar a conta", () => {
  it("reset_my_demo apaga só os registros de quem chama", async () => {
    await bruno.client.from("check_ins").insert({ emotion: "paz" });
    expect((await bruno.client.rpc("reset_my_demo")).error).toBeNull();
    expect((await bruno.client.from("check_ins").select("id")).data).toEqual([]);
    // Os registros da Ana continuam
    expect((await ana.client.from("check_ins").select("id")).data?.length).toBeGreaterThan(0);
  });

  it("delete_my_account remove o usuário e tudo em cascata", async () => {
    const carla = await newVisitor("Carla");
    await carla.client.from("check_ins").insert({ emotion: "cansaco", note: "apagar tudo" });
    expect((await carla.client.rpc("delete_my_account")).error).toBeNull();

    // Com o JWT antigo (ainda assinado), o banco não devolve mais nada do usuário apagado
    expect((await carla.client.from("profiles").select("id")).data).toEqual([]);
    expect((await carla.client.from("check_ins").select("id")).data).toEqual([]);
  });
});

describe("sem sessão", () => {
  it("o papel anônimo da API (sem login) não lê conteúdo nem dados", async () => {
    const guest = newClient();
    for (const table of ["plans", "practices", "check_ins", "profiles"] as const) {
      const { data, error } = await guest.from(table).select("*").limit(1);
      expect(data ?? []).toEqual([]);
      expect(error?.code).toBe("42501");
    }
  });
});
