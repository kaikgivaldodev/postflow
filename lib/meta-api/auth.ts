import { graphFetch } from "@/lib/meta-api/client";

export async function exchangeCodeForUserToken(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string }> {
  const data = await graphFetch<{ access_token: string }>("/oauth/access_token", {
    params: {
      client_id: process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      redirect_uri: redirectUri,
      code,
    },
  });
  return { accessToken: data.access_token };
}

// Deve rodar DEPOIS de exchangeCodeForUserToken — um Page token derivado de
// um user token de curta duração expira em ~1-2h; derivado de um user token
// de longa duração, é efetivamente não-expirante.
export async function exchangeForLongLivedUserToken(
  shortLivedToken: string
): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const data = await graphFetch<{ access_token: string; expires_in: number }>(
    "/oauth/access_token",
    {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        fb_exchange_token: shortLivedToken,
      },
    }
  );
  return { accessToken: data.access_token, expiresInSeconds: data.expires_in };
}

export type FacebookPage = {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
};

export async function listUserPagesWithInstagram(
  longLivedUserToken: string
): Promise<FacebookPage[]> {
  const data = await graphFetch<{ data: FacebookPage[] }>("/me/accounts", {
    params: {
      fields: "access_token,name,instagram_business_account",
      access_token: longLivedUserToken,
    },
  });
  return data.data;
}

export type InstagramProfile = {
  id: string;
  username: string;
  profile_picture_url?: string;
};

export async function getInstagramProfile(
  igUserId: string,
  pageAccessToken: string
): Promise<InstagramProfile> {
  return graphFetch<InstagramProfile>(`/${igUserId}`, {
    params: {
      fields: "username,profile_picture_url",
      access_token: pageAccessToken,
    },
  });
}
