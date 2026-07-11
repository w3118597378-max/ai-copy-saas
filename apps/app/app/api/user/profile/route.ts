// ============================================================
// GET /api/user/profile
// 返回当前用户的套餐信息和当日生成次数
// ============================================================

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase-server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  // 获取用户套餐
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, period_end, billing_cycle")
    .eq("id", user.id)
    .single();

  // 计算当日生成次数（只统计成功的）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: todayCount } = await supabase
    .from("generation_records")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "success")
    .gte("created_at", today.toISOString());

  return NextResponse.json({
    data: {
      plan: profile?.plan || "free",
      subscriptionStatus: profile?.subscription_status || null,
      periodEnd: profile?.period_end || null,
      billingCycle: profile?.billing_cycle || null,
      todayUsage: todayCount || 0,
      dailyLimit: profile?.plan === "pro" ? null : 3,
    },
  });
}
