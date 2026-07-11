"use client";
import React, { useState, useEffect } from "react";
import { AppSidebar, AppHeader, Badge, Table } from "@ai-copy/ui";
import { Trash2, Copy, Eye } from "lucide-react";
import { ProtectedRoute } from "../ProtectedRoute";

// ============================================================
// 类型定义（匹配 API 返回格式）
// ============================================================
interface HistoryRecord {
  id: string;
  input: {
    productName: string;
    productDescription: string;
    channel?: string;
    [key: string]: any;
  };
  output: {
    longCopy?: string;
    headline?: string;
    [key: string]: any;
  } | null;
  channel: string;
  status: string;
  createdAt: string;
}

// 渠道中文映射
const CHANNEL_LABELS: Record<string, string> = {
  website: "官网", moments: "朋友圈",
  xiaohongshu: "小红书", douyin: "抖音", email: "邮件",
  social: "社交媒体", landing_page: "落地页", ad: "广告", blog: "博客",
};

const STATUS_VARIANTS: Record<string, "success" | "danger" | "warning" | "default"> = {
  success: "success", failed: "danger",
  generating: "warning", pending: "default",
};
const STATUS_LABELS: Record<string, string> = {
  success: "成功", failed: "失败",
  generating: "生成中", pending: "等待中",
};

export default function HistoryPage() {
  // ----- 数据状态 -----
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  // ============================================================
  // 从 API 获取历史记录
  // ============================================================
  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const params = filter !== "all" ? "?status=" + filter : "";
        const res = await fetch("/api/generations" + params);
        const result = await res.json();

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setRecords(result.data);
        }
      } catch {
        setError("加载失败，请刷新重试");
      }

      setLoading(false);
    }

    fetchHistory();
  }, [filter]);

  // ============================================================
  // 删除操作
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm("确定要删除这条记录吗？删除后无法恢复。")) {
      return;
    }

    try {
      const res = await fetch("/api/generations/" + id, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert("删除失败，请重试");
    }
  };

  // ============================================================
  // 统计数据（从当前数据计算）
  // ============================================================
  const counts = {
    all: records.length,
    success: records.filter((g) => g.status === "success").length,
    failed: records.filter((g) => g.status === "failed").length,
  };

  // ============================================================
  // Table 列定义
  // ============================================================
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (r: HistoryRecord) => (
        <span className="text-xs text-gray-400 font-mono">{r.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "product",
      header: "产品",
      render: (r: HistoryRecord) => (
        <span className="text-sm font-medium text-gray-900">
          {r.input?.productName || "-"}
        </span>
      ),
    },
    {
      key: "channel",
      header: "渠道",
      render: (r: HistoryRecord) => (
        <span className="text-sm text-gray-600">
          {CHANNEL_LABELS[r.channel] || r.channel}
        </span>
      ),
    },
    {
      key: "preview",
      header: "内容预览",
      render: (r: HistoryRecord) => (
        <span className="text-sm text-gray-500 truncate block max-w-[200px]">
          {r.output?.longCopy
            ? r.output.longCopy.slice(0, 50) + "..."
            : r.output?.headline
              ? r.output.headline.slice(0, 50) + "..."
              : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "状态",
      render: (r: HistoryRecord) => (
        <Badge variant={STATUS_VARIANTS[r.status] || "default"}>
          {STATUS_LABELS[r.status] || r.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "时间",
      render: (r: HistoryRecord) => (
        <span className="text-sm text-gray-500">
          {new Date(r.createdAt).toLocaleDateString("zh-CN")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "操作",
      render: (r: HistoryRecord) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const content = r.output?.longCopy || r.output?.headline || "(无内容)";
              alert(content);
            }}
            className="rounded p-1 text-gray-400 hover:text-gray-600"
            title="查看"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const content = r.output?.longCopy || r.output?.headline || "";
              if (content) {
                navigator.clipboard?.writeText(content);
              }
            }}
            className="rounded p-1 text-gray-400 hover:text-gray-600"
            title="复制"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(r.id)}
            className="rounded p-1 text-gray-400 hover:text-red-500"
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <AppSidebar userName="用户" userPlan="free" usageLabel={"共 " + records.length + " 条记录"} />
        <div className="flex-1 flex flex-col">
          <AppHeader title="历史记录" description="查看和管理你的文案生成历史" />
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
              {/* 筛选标签 */}
              <div className="flex border-b border-gray-200 mb-6">
                {[
                  { id: "all", label: "全部" },
                  { id: "success", label: "成功" },
                  { id: "failed", label: "失败" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px " +
                      (filter === tab.id
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-gray-500")
                    }
                  >
                    {tab.label}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {counts[tab.id as keyof typeof counts]}
                    </span>
                  </button>
                ))}
              </div>

              {/* 加载中 */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
                    <p className="text-sm text-gray-400">加载中...</p>
                  </div>
                </div>
              )}

              {/* 加载失败 */}
              {error && !loading && (
                <div className="flex items-center justify-center py-20">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* 空状态 */}
              {!loading && !error && records.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-sm">还没有生成记录</p>
                  <p className="text-xs mt-1">去生成工作台创建第一条文案</p>
                </div>
              )}

              {/* 数据表格 */}
              {!loading && !error && records.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <Table
                    columns={columns}
                    data={records}
                    keyExtractor={(r: HistoryRecord) => r.id}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
