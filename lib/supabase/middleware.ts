import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasActiveAccess } from "@/lib/plan";

const PROTECTED_PREFIXES = ["/dashboard", "/calendar", "/posts", "/analytics", "/settings"];
const AUTH_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const BILLING_PATH = "/settings/billing";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: não remover — getUser() revalida o token com o servidor
  // Supabase (getSession() apenas lê o cookie, sem validação server-side).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Paywall: trial de 7 dias expirado sem assinatura ativa bloqueia o app
  // inteiro, exceto a própria página de assinatura (senão vira loop).
  if (user && isProtected && pathname !== BILLING_PATH) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_status, trial_ends_at")
      .eq("id", user.id)
      .single();

    if (profile && !hasActiveAccess(profile)) {
      return NextResponse.redirect(new URL(BILLING_PATH, request.url));
    }
  }

  return supabaseResponse;
}
