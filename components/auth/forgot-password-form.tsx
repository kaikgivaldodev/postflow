"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { forgotPasswordAction, type ActionState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: ActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="space-y-4 rounded-md border border-border bg-secondary/50 p-4 text-center">
        <p className="text-sm text-secondary-foreground">{state.success}</p>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com"
          required
        />
        {state.fieldErrors?.email && (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <SubmitButton pendingText="Enviando...">Enviar link de recuperação</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}
