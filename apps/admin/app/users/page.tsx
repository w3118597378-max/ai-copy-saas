"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar, AdminHeader, Table, Badge } from "@ai-copy/ui";
import { Loader2, AlertCircle, Search } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  plan: string;
  role: string;
  created_at: string;
}

const PLAN_MAP: Record<string, { label: string; variant: "default" | "info" | "success" }> = {
  free: { label: "免费版", variant: "default" },
  pro: { label: "Pro", variant: "info" },
  team: { label: "Team", variant: "success" },
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch("/api/admin/users?page=1&limit=100");
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
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = items.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="用户管理"
          description={loading ? "加载中..." : `共 ${items.length} 位用户`}
        />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm"
                placeholder="搜索邮箱..."
              />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center py-16 text-red-400">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={loadUsers}
                    className="mt-4 text-sm text-primary-600 hover:underline"
                  >
                    重试
                  </button>
                </div>
              ) : (
                <Table
                  columns={[
                    { key: "email", header: "邮箱", render: (u: UserItem) => (
                      <span className="text-sm text-gray-900">{u.email}</span>
                    )},
                    { key: "plan", header: "套餐", render: (u: UserItem) => (
                      <Badge variant={PLAN_MAP[u.plan]?.variant || "default"}>{PLAN_MAP[u.plan]?.label || u.plan}</Badge>
                    )},
                    { key: "role", header: "角色", render: (u: UserItem) => (
                      <span className="text-sm text-gray-600">{u.role === "admin" ? "管理员" : "用户"}</span>
                    )},
                    { key: "created_at", header: "注册时间", render: (u: UserItem) => (
                      <span className="text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString("zh-CN")}</span>
                    )},
                  ]}
                  data={filtered}
                  keyExtractor={(u: UserItem) => u.id}
                  emptyText="未找到匹配用户"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
