"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar, AdminHeader, Tabs, Table, Badge } from "@ai-copy/ui";
import { Loader2, AlertCircle } from "lucide-react";

/* ===== Types ===== */
interface UserItem {
  id: string;
  email: string;
  plan: string;
  created_at: string;
}
interface GenItem {
  id: string;
  user_email: string;
  product_name: string;
  channel: string;
  status: string;
  created_at: string;
}
interface SubItem {
  id: string;
  user_email: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
}

/* ===== Badge configs ===== */
const PLAN_MAP: Record<string, { label: string; variant: "default" | "info" | "success" }> = {
  free: { label: "免费版", variant: "default" },
  pro: { label: "Pro", variant: "info" },
  team: { label: "Team", variant: "success" },
};

const SUB_MAP: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" | "info" }> = {
  active: { label: "激活", variant: "success" },
  canceled: { label: "已取消", variant: "default" },
  past_due: { label: "逾期", variant: "danger" },
  unpaid: { label: "未支付", variant: "warning" },
  trialing: { label: "试用中", variant: "info" },
  incomplete: { label: "未完成", variant: "warning" },
  expired: { label: "已过期", variant: "default" },
};

/* ===== Reusable fetch hook ===== */
function useFetch<T>(baseUrl: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}&page=1&limit=100`);
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "获取失败");
        return;
      }
      setItems(result.items);
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }, [baseUrl]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, retry: load };
}

/* ===== Error State ===== */
function ErrorState({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-red-400">
      <AlertCircle className="h-8 w-8 mb-2" />
      <p className="text-sm">{msg}</p>
      <button onClick={onRetry} className="mt-4 text-sm text-primary-600 hover:underline">
        重试
      </button>
    </div>
  );
}

/* ===== Loading State ===== */
function LoadingState() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );
}

/* ===== Tab: 用户列表 ===== */
function UsersTab() {
  const { items, loading, error, retry } = useFetch<UserItem>("/api/admin/users?page=1");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={retry} />;

  return (
    <Table
      columns={[
        { key: "email", header: "邮箱", render: (u: UserItem) => <span className="text-sm text-gray-900">{u.email}</span> },
        { key: "plan", header: "套餐", render: (u: UserItem) => <Badge variant={PLAN_MAP[u.plan]?.variant || "default"}>{PLAN_MAP[u.plan]?.label || u.plan}</Badge> },
        { key: "created_at", header: "注册时间", render: (u: UserItem) => <span className="text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString("zh-CN")}</span> },
      ]}
      data={items}
      keyExtractor={(u: UserItem) => u.id}
      emptyText="暂无用户"
    />
  );
}

/* ===== Tab: 生成记录 ===== */
function GensTab() {
  const { items, loading, error, retry } = useFetch<GenItem>("/api/admin/generations?page=1");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={retry} />;

  return (
    <Table
      columns={[
        { key: "user", header: "用户", render: (r: GenItem) => <span className="text-sm text-gray-600">{r.user_email}</span> },
        { key: "product", header: "产品名称", render: (r: GenItem) => <span className="text-sm font-medium text-gray-900">{r.product_name}</span> },
        { key: "channel", header: "渠道", render: (r: GenItem) => <span className="text-sm text-gray-600">{r.channel}</span> },
        { key: "created_at", header: "时间", render: (r: GenItem) => <span className="text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString("zh-CN")}</span> },
      ]}
      data={items}
      keyExtractor={(r: GenItem) => r.id}
      emptyText="暂无生成记录"
    />
  );
}

/* ===== Tab: 订阅状态 ===== */
function SubsTab() {
  const { items, loading, error, retry } = useFetch<SubItem>("/api/admin/subscriptions?page=1");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={retry} />;

  return (
    <Table
      columns={[
        { key: "user", header: "用户", render: (s: SubItem) => <span className="text-sm text-gray-600">{s.user_email}</span> },
        { key: "plan", header: "套餐", render: (s: SubItem) => <Badge variant={PLAN_MAP[s.plan]?.variant || "default"}>{PLAN_MAP[s.plan]?.label || s.plan}</Badge> },
        { key: "status", header: "支付状态", render: (s: SubItem) => <Badge variant={SUB_MAP[s.status]?.variant || "default"}>{SUB_MAP[s.status]?.label || s.status}</Badge> },
        { key: "period_end", header: "到期时间", render: (s: SubItem) => (
          <span className="text-sm text-gray-500">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("zh-CN") : "-"}</span>
        )},
      ]}
      data={items}
      keyExtractor={(s: SubItem) => s.id}
      emptyText="暂无订阅记录"
    />
  );
}

/* ===== Main Page ===== */
export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="总览" description="平台运营数据" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
            <Tabs
              tabs={[
                { id: "users", label: "用户列表" },
                { id: "generations", label: "生成记录" },
                { id: "subscriptions", label: "订阅状态" },
              ]}
              defaultTab="users"
              tabContent={{
                users: <UsersTab />,
                generations: <GensTab />,
                subscriptions: <SubsTab />,
              }}
            >
              <span />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
