import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Auth 回调路由
 *
 * 用户在邮箱中点击确认链接后，Supabase 会重定向到该路由。
 * 路由会交换确认令牌并创建用户 session，然后将用户重定向到主应用。
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/generate";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // 用 code 交换 session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const redirectTo = isLocalEnv
        ? `${origin}${next}`
        : forwardedHost
          ? `https://${forwardedHost}${next}`
          : `${process.env.NEXT_PUBLIC_APP_URL}${next}`;
      return NextResponse.redirect(redirectTo);
    }
  }

  // 如果 code 无效或交换失败，重定向到登录页
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_callback_failed`
  );
}
