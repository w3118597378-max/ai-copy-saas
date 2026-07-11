// ============================================================
// GET /api/billing
// Admin: 查看所有支付账单记录（支持分页）
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

function getAuthClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  // Step 1: 验证登录
  const supabase = getAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  // Step 2: 验证管理员身份
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  // Step 3: 分页参数
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  // Step 4: 查询 billing_records 表
  const adminClient = getAdminClient();
  const { data: rows, error, count } = await adminClient
    .from("billing_records")
    .select("*", { count: "exact" })
    .order("paid_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Admin billing query error:", error);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }

  // Step 5: 获取用户邮箱映射
  const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers();
  const emailMap = new Map<string, string>();
  (authUsers || []).forEach((u: any) => emailMap.set(u.id, u.email || ""));

  // Step 6: 格式化返回
  const items = (rows || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userEmail: emailMap.get(r.user_id) || "",
    planCode: r.plan_code || "pro",
    billingCycle: r.billing_cycle || "monthly",
    amount: (r.amount_cents ?? 0) / 100, // 分 → 元
    status: r.status || "pending",
    createdAt: r.created_at || r.paid_at || new Date().toISOString(),
    paidAt: r.paid_at || null,
  }));

  return NextResponse.json({
    items,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
