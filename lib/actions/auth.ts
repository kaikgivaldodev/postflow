"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

export type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

const GENERIC_LOGIN_ERROR =
  "Credenciais inválidas. Verifique seu email e senha.";

async function getAppUrl() {
  const h = await headers();
  const origin = h.get("origin");
  return origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Mensagem sempre genérica — nunca revelar se o email existe, se a senha
  // está errada ou se a conta está desativada (seção 7, item 5).
  if (error) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  const redirectTo = formData.get("redirect");
  redirect(typeof redirectTo === "string" && redirectTo ? redirectTo : "/dashboard");
}

export async function signupAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    cpf: formData.get("cpf"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptedTerms: formData.get("acceptedTerms") === "on",
    marketingOptIn: formData.get("marketingOptIn") === "on",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Checa duplicidade de CPF/telefone antes de criar a conta — precisa do
  // client admin (service role) pois a linha em profiles ainda não existe
  // e RLS bloquearia essa busca pro client anônimo.
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("profiles")
    .select("cpf, phone")
    .or(`cpf.eq.${parsed.data.cpf},phone.eq.${parsed.data.phone}`);

  if (existing?.some((row) => row.cpf === parsed.data.cpf)) {
    return {
      fieldErrors: { cpf: ["Este CPF já está cadastrado."] },
    };
  }
  if (existing?.some((row) => row.phone === parsed.data.phone)) {
    return {
      fieldErrors: { phone: ["Este telefone já está cadastrado."] },
    };
  }

  const supabase = await createClient();
  const appUrl = await getAppUrl();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        cpf: parsed.data.cpf,
        marketing_opt_in: parsed.data.marketingOptIn,
      },
    },
  });

  if (error) {
    if (error.status === 422) {
      return {
        error: "Este email já está cadastrado. Faça login ou recupere sua senha.",
      };
    }
    return { error: "Não foi possível concluir o cadastro. Tente novamente." };
  }

  // Se o projeto Supabase tiver "Confirm email" desativado, signUp() já
  // retorna uma sessão ativa — nesse caso loga direto em vez de pedir
  // confirmação por email que nunca vai chegar.
  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success:
      "Quase lá! Enviamos um link de confirmação para o seu email. Verifique sua caixa de entrada (e o spam).",
  };
}

export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const appUrl = await getAppUrl();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });

  // Mesma resposta independentemente do email existir ou não — evita
  // enumeração de usuários (seção 7, item 5).
  return {
    success:
      "Se existir uma conta com esse email, enviamos um link para redefinir sua senha.",
  };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      error:
        "Não foi possível redefinir sua senha. O link pode ter expirado — solicite um novo.",
    };
  }

  redirect("/login?reset=success");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
