import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Entrar na sua conta</h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta. Agende seus posts em segundos.
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
