import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Redefinir senha",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Definir nova senha</h1>
        <p className="text-sm text-muted-foreground">
          Escolha uma nova senha para sua conta PostFlow.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
