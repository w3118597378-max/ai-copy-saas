// ============================================================
// GET /api/generations
// 获取当前用户的历史生成记录（支持分页和状态筛选）
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../lib/supabase-server";

export async function GET(request: NextRequest) {
  // 第 1 步：验证登录
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "请先登录" },
      { status: 401 }
    );
  }

  // 第 2 步：从 URL 获取查询参数
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

  // 第 3 步：查询数据库
  let query = supabase
    .from("generation_records")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(
      (page - 1) * limit,
      page * limit - 1
    );

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: records, count, error } = await query;

  if (error) {
    console.error("查询历史记录失败:", error);
    return NextResponse.json(
      { error: "查询失败" },
      { status: 500 }
    );
  }

  // 第 4 步：格式化返回数据
  const formatted = (records || []).map((record: any) => ({
    id: record.id,
    input: record.input_data,
    output: record.output_data,
    channel: record.channel,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  }));

  return NextResponse.json({
    data: formatted,
    meta: {
      total: count || 0,
      page,
      limit,
    },
  });
}
