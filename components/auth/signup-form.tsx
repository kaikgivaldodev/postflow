"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signupAction, type ActionState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: ActionState = {};

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialState);

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
      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          required
        />
        {state.fieldErrors?.fullName && (
          <p className="text-sm text-destructive">{state.fieldErrors.fullName[0]}</p>
        )}
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
        <p className="text-xs text-muted-foreground">
          Mínimo 8 caracteres, com maiúscula, minúscula e número.
        </p>
        {state.fieldErrors?.password && (
          <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox id="acceptedTerms" name="acceptedTerms" required className="mt-0.5" />
          <Label htmlFor="acceptedTerms" className="text-sm font-normal leading-snug">
            Concordo com os{" "}
            <Link href="/termos" className="text-primary hover:underline" target="_blank">
              Termos de Serviço
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" className="text-primary hover:underline" target="_blank">
              Política de Privacidade
            </Link>
          </Label>
        </div>
        {state.fieldErrors?.acceptedTerms && (
          <p className="text-sm text-destructive">{state.fieldErrors.acceptedTerms[0]}</p>
        )}

        <div className="flex items-start gap-2">
          <Checkbox id="marketingOptIn" name="marketingOptIn" className="mt-0.5" />
          <Label htmlFor="marketingOptIn" className="text-sm font-normal leading-snug">
            Quero receber emails sobre novidades e dicas de marketing
          </Label>
        </div>
      </div>

      <SubmitButton pendingText="Criando conta...">
        Criar conta grátis
      </SubmitButton>

      <p className="text-center text-xs text-muted-foreground">
        Sem cartão de crédito necessário.
      </p>
    </form>
  );
}
