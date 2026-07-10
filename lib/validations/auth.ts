import { z } from "zod";
import { isValidCPF, isValidPhone, normalizeCPF, normalizePhone } from "@/lib/validations/cpf";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe seu email").email("Email inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Informe seu nome completo").max(100),
    email: z.string().trim().min(1, "Informe seu email").email("Email inválido"),
    phone: z
      .string()
      .trim()
      .min(1, "Informe seu telefone")
      .refine(isValidPhone, "Telefone inválido")
      .transform(normalizePhone),
    cpf: z
      .string()
      .trim()
      .min(1, "Informe seu CPF")
      .refine(isValidCPF, "CPF inválido")
      .transform(normalizeCPF),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter ao menos um número"),
    confirmPassword: z.string(),
    acceptedTerms: z.literal(true, {
      message: "Você precisa aceitar os Termos de Serviço e a Política de Privacidade",
    }),
    marketingOptIn: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Informe seu email").email("Email inválido"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter ao menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
