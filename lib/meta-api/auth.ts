import { graphFetch, GraphApiError } from "@/lib/meta-api/client";

const IG_OAUTH_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const IG_LONG_LIVED_TOKEN_URL = "https://graph.instagram.com/access_token";

// A resposta da troca de código do Login do Instagram vem envolta em
// `data: [...]` (formato herdado da Instagram Basic Display API), diferente
// da troca de token de longa duração, que retorna o objeto direto.
type ShortLivedTokenResponse =
  | { data: [{ access_token: string; user_id: string | number }] }
  | { access_token: string; user_id: string | number };

export async function exchangeCodeForUserToken(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; igUserId: string }> {
  const body = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(IG_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await response.json()) as ShortLivedTokenResponse & {
    error_message?: string;
  };

  if (!response.ok) {
    throw new GraphApiError(
      json.error_message || `Falha ao trocar código por token (${response.status})`,
      undefined,
      undefined,
      undefined,
      json
    );
  }

  const result = "data" in json ? json.data[0] : json;
  return { accessToken: result.access_token, igUserId: String(result.user_id) };
}

// Deve rodar DEPOIS de exchangeCodeForUserToken — o token curto expira em ~1h;
// o de longa duração (60 dias) precisa ser renovado periodicamente antes de expirar.
export async function exchangeForLongLivedUserToken(
  shortLivedToken: string
): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const url = new URL(IG_LONG_LIVED_TOKEN_URL);
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", process.env.META_APP_SECRET!);
  url.searchParams.set("access_token", shortLivedToken);

  const response = await fetch(url.toString());
  const json = (await response.json()) as {
    access_token: string;
    expires_in: number;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new GraphApiError(
      json.error?.message || `Falha ao obter token de longa duração (${response.status})`,
      undefined,
      undefined,
      undefined,
      json
    );
  }

  return { accessToken: json.access_token, expiresInSeconds: json.expires_in };
}

export type InstagramProfile = {
  id: string;
  username: string;
  profile_picture_url?: string;
};

export async function getInstagramProfile(
  igUserId: string,
  accessToken: string
): Promise<InstagramProfile> {
  return graphFetch<InstagramProfile>(`/${igUserId}`, {
    params: {
      fields: "username,profile_picture_url",
      access_token: accessToken,
    },
  });
}
