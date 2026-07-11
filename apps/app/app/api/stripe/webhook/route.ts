// ============================================================
// POST /api/stripe/webhook
// Stripe 异步回调
// 开发环境需用 Stripe CLI 转发: stripe listen --forward-to localhost:3001/api/stripe/webhook
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

// Webhook 需要用 Service Role Key（绕过 RLS）
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/** 从 Stripe 订阅中提取 plan_code */
function inferPlanCode(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price.id || "";
  // 根据 price ID 前缀推断：如果 env 里配了对应价格
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) return "pro";
  return "pro";
}

/** 从 Stripe 订阅中提取 billing_cycle */
function inferBillingCycle(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price.id || "";
  if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) return "yearly";
  return "monthly";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook 签名验证失败:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ================================================================
  // checkout.session.completed — 首次订阅付款成功
  // ================================================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (!userId) {
      console.error("Webhook: 缺少 user_id 元数据");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const planCode = session.metadata?.plan_code || inferPlanCode(subscription);
    const billingCycle = session.metadata?.billing_cycle || inferBillingCycle(subscription);

    // 写入 subscriptions 表
    await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
      plan: planCode,
      status: subscription.status,
      price_id: subscription.items.data[0]?.price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });

    // 更新 profiles（用 upsert 防止用户缺少 profile 行）
    await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        plan: planCode,
        billing_cycle: billingCycle,
        stripe_customer_id: session.customer as string,
        subscription_id: subscriptionId,
        subscription_status: subscription.status,
        period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      });

    // 写入 billing_records
    const invoiceId = typeof session.invoice === "string" ? session.invoice : undefined;
    const amountTotal = session.amount_total ?? 0;
    await supabaseAdmin.from("billing_records").insert({
      user_id: userId,
      stripe_session_id: session.id,
      stripe_invoice_id: invoiceId,
      stripe_subscription_id: subscriptionId,
      plan_code: planCode,
      billing_cycle: billingCycle,
      amount_cents: amountTotal,
      currency: session.currency || "cny",
      status: "paid",
      paid_at: new Date().toISOString(),
    });

    console.log(`[Webhook] checkout.session.completed: user=${userId}, plan=${planCode}, cycle=${billingCycle}, amount=${amountTotal}`);
  }

  // ================================================================
  // invoice.paid — 订阅续费成功
  // ================================================================
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;

    // 只处理订阅发票，非首次付款（首次由 checkout.session.completed 处理）
    if (!invoice.subscription || invoice.billing_reason === "subscription_create") {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // 通过 stripe_subscription_id 找到用户
    const { data: subs } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id, plan")
      .eq("stripe_subscription_id", subscriptionId)
      .limit(1);

    if (!subs || subs.length === 0) {
      console.error("Webhook: 续费但找不到订阅记录", subscriptionId);
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const userId = subs[0].user_id;
    const planCode = inferPlanCode(subscription);
    const billingCycle = inferBillingCycle(subscription);

    // 更新订阅有效期
    await supabaseAdmin
      .from("subscriptions")
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    // 更新 profiles
    await supabaseAdmin
      .from("profiles")
      .update({
        period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    // 写入续费 billing_records
    const amountPaid = invoice.amount_paid ?? 0;
    await supabaseAdmin.from("billing_records").insert({
      user_id: userId,
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      plan_code: planCode,
      billing_cycle: billingCycle,
      amount_cents: amountPaid,
      currency: invoice.currency || "cny",
      status: "paid",
      paid_at: new Date().toISOString(),
    });

    console.log(`[Webhook] invoice.paid: user=${userId}, subscription=${subscriptionId}, amount=${amountPaid}`);
  }

  // ================================================================
  // invoice.payment_failed — 扣款失败
  // ================================================================
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    if (!invoice.subscription) return NextResponse.json({ received: true });

    const subscriptionId = invoice.subscription as string;

    const { data: subs } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscriptionId)
      .limit(1);

    if (subs && subs.length > 0) {
      const userId = subs[0].user_id;

      // 更新 profiles 状态
      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      // 写入失败的 billing_records
      await supabaseAdmin.from("billing_records").insert({
        user_id: userId,
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: subscriptionId,
        plan_code: "pro",
        billing_cycle: "monthly",
        amount_cents: invoice.amount_due ?? 0,
        currency: invoice.currency || "cny",
        status: "failed",
      });

      console.log(`[Webhook] invoice.payment_failed: user=${userId}`);
    }
  }

  // ================================================================
  // customer.subscription.updated — 订阅变更（升级/降级/恢复）
  // ================================================================
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .limit(1);

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ received: true });
    }

    const userId = profiles[0].id;
    const planCode = inferPlanCode(subscription);
    const billingCycle = inferBillingCycle(subscription);

    // 更新 subscriptions
    await supabaseAdmin
      .from("subscriptions")
      .update({
        plan: planCode,
        status: subscription.status,
        price_id: subscription.items.data[0]?.price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);

    // 更新 profiles
    await supabaseAdmin
      .from("profiles")
      .update({
        plan: planCode,
        billing_cycle: billingCycle,
        subscription_status: subscription.status,
        period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    console.log(`[Webhook] customer.subscription.updated: user=${userId}, plan=${planCode}, status=${subscription.status}`);
  }

  // ================================================================
  // customer.subscription.deleted — 取消订阅
  // ================================================================
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .limit(1);

    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;

      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          billing_cycle: null,
          subscription_id: null,
          subscription_status: "canceled",
          period_end: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subscription.id);

      // 写入取消记录
      await supabaseAdmin.from("billing_records").insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        plan_code: "free",
        billing_cycle: "monthly",
        amount_cents: 0,
        currency: "cny",
        status: "canceled",
      });

      console.log(`[Webhook] customer.subscription.deleted: user=${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}
