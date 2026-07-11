"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function disconnectInstagramAccountAction(
  accountId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("instagram_accounts")
    .delete()
    .eq("id", accountId)
    .eq("user_id", user.id); // IDOR — só o dono desconecta (seção 7)

  if (error) {
    return { error: "Não foi possível desconectar a conta. Tente novamente." };
  }

  revalidatePath("/settings/accounts");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return {};
}
