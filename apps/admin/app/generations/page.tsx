"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar, AdminHeader, Table, Badge } from "@ai-copy/ui";
import { Loader2, AlertCircle } from "lucide-react";

interface GenItem {
  id: string;
  user_email: string;
  product_name: string;
  channel: string;
  status: string;
  created_at: string;
}

const GEN_MAP: Record<string, { label: string; variant: "success" | "danger" | "warning" }> = {
  success: { label: "成功", variant: "success" },
  failed: { label: "失败", variant: "danger" },
  generating: { label: "生成中", variant: "warning" },
};

export default function AdminGenerationsPage() {
  const [items, setItems] = useState<GenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch("/api/admin/generations?page=1&limit=100");
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
    loadData();
  }, [loadData]);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="生成记录"
          description={loading ? "加载中..." : `共 ${items.length} 条记录`}
        />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
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
                    onClick={loadData}
                    className="mt-4 text-sm text-primary-600 hover:underline"
                  >
                    重试
                  </button>
                </div>
              ) : (
                <Table
                  columns={[
                    { key: "user", header: "用户", render: (r: GenItem) => <span className="text-sm text-gray-600">{r.user_email}</span> },
                    { key: "product", header: "产品名称", render: (r: GenItem) => <span className="text-sm font-medium text-gray-900">{r.product_name}</span> },
                    { key: "channel", header: "渠道", render: (r: GenItem) => <span className="text-sm text-gray-600">{r.channel}</span> },
                    { key: "status", header: "状态", render: (r: GenItem) => <Badge variant={GEN_MAP[r.status]?.variant || "default"}>{GEN_MAP[r.status]?.label || r.status}</Badge> },
                    { key: "created_at", header: "时间", render: (r: GenItem) => <span className="text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString("zh-CN")}</span> },
                  ]}
                  data={items}
                  keyExtractor={(r: GenItem) => r.id}
                  emptyText="暂无生成记录"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
