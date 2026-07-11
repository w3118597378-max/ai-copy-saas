"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar, AdminHeader, Badge, Table } from "@ai-copy/ui";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface BillingItem {
  id: string;
  userId: string;
  userEmail: string;
  planCode: string;
  billingCycle: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_CFG: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" | "info" }> = {
  paid: { label: "已支付", variant: "success" },
  pending: { label: "处理中", variant: "warning" },
  failed: { label: "失败", variant: "danger" },
  refunded: { label: "已退款", variant: "default" },
  canceled: { label: "已取消", variant: "info" },
};

const CYCLE_LABEL: Record<string, string> = {
  monthly: "月付",
  yearly: "年付",
};

export default function AdminBillingPage() {
  const [items, setItems] = useState<BillingItem[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBilling = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/billing?page=${page}&limit=20`);
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "获取数据失败");
        return;
      }
      setItems(result.items);
      setMeta(result.meta);
    } catch {
      setError("网络错误，请重试");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBilling(1);
  }, [fetchBilling]);

  const handlePrev = () => {
    if (meta.page > 1) fetchBilling(meta.page - 1);
  };

  const handleNext = () => {
    if (meta.page < meta.totalPages) fetchBilling(meta.page + 1);
  };

  const columns = [
    {
      key: "id",
      header: "订单号",
      render: (r: BillingItem) => (
        <span className="text-xs text-gray-400 font-mono">{r.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "user",
      header: "用户",
      render: (r: BillingItem) => (
        <span className="text-sm text-gray-600">{r.userEmail}</span>
      ),
    },
    {
      key: "plan",
      header: "套餐",
      render: (r: BillingItem) => (
        <span className="text-sm font-medium text-gray-900">
          {r.planCode.toUpperCase()}
        </span>
      ),
    },
    {
      key: "cycle",
      header: "周期",
      render: (r: BillingItem) => (
        <span className="text-xs text-gray-500">{CYCLE_LABEL[r.billingCycle] || r.billingCycle}</span>
      ),
    },
    {
      key: "amount",
      header: "金额",
      render: (r: BillingItem) => (
        <span className="text-sm font-medium text-gray-900">
          ¥{r.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "状态",
      render: (r: BillingItem) => (
        <Badge variant={STATUS_CFG[r.status]?.variant || "default"}>
          {STATUS_CFG[r.status]?.label || r.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "日期",
      render: (r: BillingItem) => (
        <span className="text-sm text-gray-500">
          {new Date(r.createdAt).toLocaleDateString("zh-CN")}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="支付与订阅"
          description={
            loading
              ? "加载中..."
              : `共 ${meta.total} 条订单记录`
          }
        />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* 加载状态 */}
              {loading && items.length === 0 && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              )}

              {/* 错误状态 */}
              {error && (
                <div className="flex flex-col items-center justify-center py-16 text-red-400">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={() => fetchBilling(meta.page)}
                    className="mt-4 text-sm text-primary-600 hover:underline"
                  >
                    重试
                  </button>
                </div>
              )}

              {/* 数据表格 */}
              {!loading && !error && (
                <Table
                  columns={columns}
                  data={items}
                  keyExtractor={(r) => r.id}
                  emptyText="暂无支付记录"
                />
              )}

              {/* 分页 */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                  <span className="text-sm text-gray-500">
                    第 {meta.page}/{meta.totalPages} 页
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={meta.page <= 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      上一页
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={meta.page >= meta.totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      下一页
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
