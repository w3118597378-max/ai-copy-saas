// ============================================================
// GET /api/admin/generations
// Admin: list all generation records with user emails
// Supports pagination: ?page=1&limit=20
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
  // Step 1: Verify login
  const supabase = getAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  // Step 2: Verify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  // Step 3: Pagination params
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  // Step 4: Query generation_records
  const adminClient = getAdminClient();
  const { data: rows, error, count } = await adminClient
    .from("generation_records")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Admin generations query error:", error);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }

  // Step 5: Get emails from auth.users
  const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers();
  const emailMap = new Map<string, string>();
  (authUsers || []).forEach((u: any) => emailMap.set(u.id, u.email || ""));

  const items = (rows || []).map((r: any) => ({
    id: r.id,
    user_id: r.user_id,
    user_email: emailMap.get(r.user_id) || "",
    product_name: r.input_data?.productName || "",
    channel: r.input_data?.channel || r.channel || "",
    status: r.status,
    created_at: r.created_at,
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
