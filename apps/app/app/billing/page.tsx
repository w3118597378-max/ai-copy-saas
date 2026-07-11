"use client";
import React, { useState, useEffect } from "react";
import { AppSidebar, AppHeader, PricingCard, cn } from "@ai-copy/ui";
import { useAuth } from "@ai-copy/ui";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { ProtectedRoute } from "../ProtectedRoute";
import type { UserPlan } from "@ai-copy/shared";

interface UserProfile {
  plan: string;
  subscriptionStatus: string | null;
  periodEnd: string | null;
  billingCycle: string | null;
  todayUsage: number;
  dailyLimit: number | null;
}

interface ProfileFetchError {
  message: string;
}

const PLANS = [
  {
    code: "free" as UserPlan,
    name: "Free",
    description: "适合初次体验，零成本开始",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "每日 3 次文案生成",
      "5 种投放渠道",
      "基础文案模板",
      "7 天历史记录",
    ],
    highlighted: false,
    ctaText: "免费使用",
  },
  {
    code: "pro" as UserPlan,
    name: "Pro",
    description: "适合独立运营者和创业者",
    monthlyPrice: 79,
    yearlyPrice: 788,
    highlighted: true,
    features: [
      "无限文案生成",
      "全部投放渠道",
      "全部文案模板",
      "无限历史记录",
      "优先生成队列",
      "结果导出 (PDF/MD)",
    ],
    ctaText: "升级 Pro",
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // 读取 URL 参数：?success=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setSuccessMsg(true);
      window.history.replaceState({}, "", "/billing");
    }
  }, []);

  // 加载用户套餐信息
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const result = await res.json();
        if (result.data) {
          setProfile(result.data);

          // 如果有订阅，恢复 billingCycle 显示
          if (result.data.billingCycle === "yearly") {
            setIsAnnual(true);
          }
        }
      } catch {
        setProfileError("加载套餐信息失败，请刷新页面重试");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const isPro = profile?.plan === "pro";

  const handleSelect = async (planCode: string) => {
    if (planCode === "free") return;
    // 已经 Pro 了，用 Portal 管理订阅
    if (isPro) return;

    setCheckoutLoading(planCode);
    try {
      const billingCycle = isAnnual ? "yearly" : "monthly";
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planCode, billingCycle }),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("创建支付会话失败，请重试");
      }
    } catch {
      alert("网络错误，请重试");
    }
    setCheckoutLoading(null);
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      alert("打开管理页面失败");
    }
    setPortalLoading(false);
  };

  const plan = isPro ? "Pro" : "Free";
  const billingLabel = profile?.billingCycle === "yearly" ? "年付" : "月付";
  const usageText = isPro
    ? `已生成 ${profile?.todayUsage || 0} 次（无限制）`
    : `今日已用 ${profile?.todayUsage || 0} / 3 次`;

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <AppSidebar
          userName={user?.email?.split("@")[0] || "用户"}
          userPlan={profile?.plan || "free"}
          usageLabel={usageText}
        />
        <div className="flex-1 flex flex-col">
          <AppHeader title="套餐管理" description="查看和升级你的套餐方案" />

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto space-y-10">
              {/* 支付成功提示 */}
              {successMsg && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-800 font-medium">
                      支付成功！🎉 你已升级为 Pro 套餐，现在可以无限次生成文案了。
                    </p>
                  </div>
                </div>
              )}

              {/* 加载失败提示 */}
              {profileError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <p className="text-sm text-red-800">{profileError}</p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-sm font-medium text-red-700 hover:text-red-600"
                    >
                      刷新
                    </button>
                  </div>
                </div>
              )}

              {/* 当前套餐卡片 */}
              <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600 font-medium">当前套餐</p>
                    {loading ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        <span className="text-sm text-gray-400">加载中...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {plan}
                          {profile?.billingCycle && isPro && (
                            <span className="text-sm font-normal text-gray-400 ml-2">
                              · {billingLabel}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{usageText}</p>
                      </>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                {isPro && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {portalLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      管理订阅
                    </button>
                  </div>
                )}
                {!isPro && !loading && (
                  <p className="text-xs text-gray-400 mt-3">
                    {profile?.periodEnd
                      ? `免费试用至 ${new Date(profile.periodEnd).toLocaleDateString("zh-CN")}`
                      : "当前为免费套餐，升级 Pro 解锁无限生成"}
                  </p>
                )}
              </div>

              {/* 套餐选择区 — 仅非 Pro 用户显示 */}
              {!isPro && (
                <div>
                  {/* 月/年付切换 */}
                  <div className="flex items-center justify-center gap-3 mb-10">
                    <span
                      className={cn(
                        "text-sm",
                        !isAnnual ? "font-semibold text-gray-900" : "text-gray-500"
                      )}
                    >
                      月付
                    </span>
                    <button
                      onClick={() => setIsAnnual(!isAnnual)}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        isAnnual ? "bg-primary-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                          isAnnual && "translate-x-5"
                        )}
                      />
                    </button>
                    <span
                      className={cn(
                        "text-sm",
                        isAnnual ? "font-semibold text-gray-900" : "text-gray-500"
                      )}
                    >
                      年付
                      <span className="text-xs text-green-600 ml-1 font-medium">
                        省 17%
                      </span>
                    </span>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto items-start">
                    {PLANS.slice(1).map((p) => (
                      <PricingCard
                        key={p.code}
                        plan={p}
                        isAnnual={isAnnual}
                        onSelect={() => handleSelect(p.code)}
                      />
                    ))}
                  </div>

                  {checkoutLoading && (
                    <div className="flex items-center justify-center mt-6">
                      <Loader2 className="h-5 w-5 animate-spin text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500">正在跳转到支付页面...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Pro 用户的提示区 */}
              {isPro && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-green-50 px-6 py-3 border border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      你已是 Pro 会员，享受所有高级功能
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    如需更换套餐或取消订阅，请点击上方「管理订阅」
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
