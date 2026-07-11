// ============================================================
// POST /api/stripe/checkout
// 创建 Stripe Checkout Session，返回跳转 URL
// 接收 { plan: "pro", billingCycle: "monthly" | "yearly" }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../lib/supabase-server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

// 服务端价格映射（不要暴露给 client）
const PRICE_MAP: Record<string, Record<string, string>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
};

const ALLOWED_PLANS = ["pro"] as const;

export async function POST(request: NextRequest) {
  // 验证登录
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  // 解析请求体
  let body: { plan?: string; billingCycle?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const plan = body.plan || "pro";
  const billingCycle = body.billingCycle || "monthly";

  // 校验 plan
  if (!ALLOWED_PLANS.includes(plan as any)) {
    return NextResponse.json({ error: "无效的套餐" }, { status: 400 });
  }

  // 获取对应的 Stripe Price ID
  const priceId = PRICE_MAP[plan]?.[billingCycle];
  if (!priceId) {
    return NextResponse.json({ error: "无效的套餐或付费周期" }, { status: 400 });
  }

  // 获取或创建 Stripe Customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .upsert({ id: user.id, stripe_customer_id: customerId });
  }

  // 创建 Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    metadata: {
      user_id: user.id,
      plan_code: plan,
      billing_cycle: billingCycle,
    },
  });

  return NextResponse.json({ url: session.url });
}
