import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeCodeForUserToken,
  exchangeForLongLivedUserToken,
  getInstagramProfile,
} from "@/lib/meta-api/auth";
import { encrypt } from "@/lib/encryption";

function redirectWithClearedCookie(request: NextRequest, path: string) {
  const res = NextResponse.redirect(new URL(path, request.url));
  res.cookies.set("ig_oauth_state", "", { maxAge: 0, path: "/api/instagram" });
  return res;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("error")) {
    return redirectWithClearedCookie(request, "/settings/accounts?error=oauth_denied");
  }

  const cookieState = request.cookies.get("ig_oauth_state")?.value;
  const queryState = searchParams.get("state");
  if (!cookieState || cookieState !== queryState) {
    return redirectWithClearedCookie(request, "/settings/accounts?error=oauth_state_mismatch");
  }

  const code = searchParams.get("code");
  if (!code) {
    return redirectWithClearedCookie(request, "/settings/accounts?error=unknown");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { accessToken: shortLived, igUserId } = await exchangeCodeForUserToken(
      code,
      process.env.META_REDIRECT_URI!
    );
    const { accessToken: longLivedToken } = await exchangeForLongLivedUserToken(shortLived);

    const [{ data: profile }, { count: currentCount }, { data: existing }] = await Promise.all([
      supabase.from("profiles").select("plan_id").eq("id", user.id).single(),
      supabase
        .from("instagram_accounts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("instagram_accounts")
        .select("id")
        .eq("user_id", user.id)
        .eq("ig_user_id", igUserId)
        .maybeSingle(),
    ]);

    const { data: limits } = await supabase
      .from("plan_limits")
      .select("max_instagram_accounts")
      .eq("plan_id", profile?.plan_id ?? "pro")
      .single();
    const maxAccounts = limits?.max_instagram_accounts ?? -1;

    if (!existing && maxAccounts !== -1 && (currentCount ?? 0) >= maxAccounts) {
      return redirectWithClearedCookie(request, "/settings/accounts?error=limit_reached");
    }

    const profileInfo = await getInstagramProfile(igUserId, longLivedToken);
    const { error } = await supabase.from("instagram_accounts").upsert(
      {
        user_id: user.id,
        ig_user_id: igUserId,
        ig_username: profileInfo.username,
        access_token: encrypt(longLivedToken),
        profile_picture_url: profileInfo.profile_picture_url ?? null,
      },
      { onConflict: "user_id,ig_user_id" }
    );

    if (error) {
      return redirectWithClearedCookie(request, "/settings/accounts?error=unknown");
    }
    return redirectWithClearedCookie(request, "/settings/accounts?success=1");
  } catch {
    return redirectWithClearedCookie(request, "/settings/accounts?error=token_exchange_failed");
  }
}
