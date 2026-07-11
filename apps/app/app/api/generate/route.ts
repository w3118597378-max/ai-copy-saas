// ============================================================
// POST /api/generate
// 接收前端表单数据 → 保存到数据库 → AI 生成文案 → 返回结果
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../lib/supabase-server";
import { generateCopy } from "../../lib/ai";

export async function POST(request: NextRequest) {
  // ============================================================
  // 第 1 步：验证用户是否已登录
  // ============================================================
  const supabase = createServerSupabaseClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "请先登录" },
      { status: 401 }
    );
  }

  // ============================================================
  // 第 1.5 步：检查免费用户每日生成限额（每日最多 3 次成功）
  // ============================================================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const userPlan = profile?.plan || "free";

  if (userPlan === "free") {
    const { count: todayCount } = await supabase
      .from("generation_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "success")
      .gte("created_at", today.toISOString());

    if (todayCount !== null && todayCount >= 3) {
      return NextResponse.json(
        { error: "每日免费生成次数已达上限（3次），升级 Pro 可无限生成" },
        { status: 429 }
      );
    }
  }

  // ============================================================
  // 第 2 步：解析前端传来的表单数据
  // ============================================================
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "请求数据格式错误" },
      { status: 400 }
    );
  }

  const {
    productName,
    productDescription,
    targetAudience,
    sellingPoints,
    channel,
  } = body as {
    productName?: string;
    productDescription?: string;
    targetAudience?: string;
    sellingPoints?: string[];
    channel?: string;
  };

  // 验证必填字段
  if (!productName || typeof productName !== "string" || productName.trim() === "") {
    return NextResponse.json(
      { error: "产品名称不能为空" },
      { status: 400 }
    );
  }

  // ============================================================
  // 第 3 步：把用户输入保存到数据库（status = 'generating'）
  // ============================================================
  const inputData = {
    productName: productName || "",
    productDescription: productDescription || "",
    targetAudience: targetAudience || "",
    sellingPoints: sellingPoints || [],
    channel: channel || "website",
  };

  const { data: record, error: insertError } = await supabase
    .from("generation_records")
    .insert({
      user_id: user.id,
      input_data: inputData,
      channel: channel || "website",
      status: "generating",
    })
    .select()
    .single();

  if (insertError) {
    console.error("保存生成记录失败:", insertError);
    return NextResponse.json(
      { error: "保存失败，请重试" },
      { status: 500 }
    );
  }

  // ============================================================
  // 第 4 步：调用 DeepSeek AI 生成文案
  // ============================================================
  let outputData: Awaited<ReturnType<typeof generateCopy>>;
  try {
    outputData = await generateCopy({
      productName: productName || "",
      productDescription: productDescription || "",
      targetAudience: targetAudience || "",
      sellingPoints: sellingPoints || [],
      channel: channel || "website",
    });
  } catch (err) {
    console.error("AI 生成失败:", err);
    // 更新数据库状态为 failed
    await supabase
      .from("generation_records")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    return NextResponse.json(
      { error: "文案生成失败，请重试" },
      { status: 500 }
    );
  }

  // ============================================================
  // 第 5 步：把生成结果保存到数据库（更新状态为 success）
  // ============================================================
  const { error: updateError } = await supabase
    .from("generation_records")
    .update({
      status: "success",
      output_data: outputData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", record.id);

  if (updateError) {
    console.error("更新生成结果失败:", updateError);
  }

  // ============================================================
  // 第 6 步：返回结果给前端
  // ============================================================
  return NextResponse.json({
    data: {
      id: record.id,
      input: inputData,
      output: outputData,
      status: "success",
      createdAt: new Date().toISOString(),
    },
  });
}
