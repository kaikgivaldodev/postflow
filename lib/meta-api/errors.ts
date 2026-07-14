import { GraphApiError } from "@/lib/meta-api/client";

export function parseGraphErrorToPortuguese(error: unknown): string {
  if (!(error instanceof GraphApiError)) {
    return error instanceof Error ? error.message : "Erro desconhecido ao publicar no Instagram.";
  }

  const { code, subcode, message } = error;

  if (code === 190) {
    return "Conexão com o Instagram expirou — reconecte a conta em Configurações.";
  }
  if (code === 200 || code === 10) {
    return "Permissão insuficiente para publicar nesta conta. Reconecte a conta em Configurações.";
  }
  if (code === 100) {
    return `O Instagram rejeitou a mídia enviada (formato ou dimensões inválidas). Detalhe: ${message}`;
  }
  if (code === 4 || code === 17 || code === 32) {
    return "Limite de requisições do Instagram atingido — tentaremos novamente na próxima execução.";
  }
  if (subcode === 2207026) {
    return message || "O Instagram não conseguiu processar a mídia enviada.";
  }

  return `Erro do Instagram (código ${code ?? "desconhecido"}): ${message}`;
}

// Erros transitórios não devem marcar o post como falho — a próxima execução
// do cron tenta de novo automaticamente.
export function isTransientGraphError(error: unknown): boolean {
  if (!(error instanceof GraphApiError)) return false;
  return error.code === 4 || error.code === 17 || error.code === 32;
}
