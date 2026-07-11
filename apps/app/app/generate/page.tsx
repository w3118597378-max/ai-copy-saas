"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AppSidebar, AppHeader, CopyForm, ResultPanel, useAuth } from "@ai-copy/ui";
import { COPY_CHANNELS } from "@ai-copy/shared";
import type { CopyFormData, CopyOutput } from "@ai-copy/shared";
import { ProtectedRoute } from "../ProtectedRoute";

// ============================================================
// 类型定义
// ============================================================
interface GenerationRecord {
  id: string;
  input: {
    productName: string;
    productDescription: string;
    targetAudience: string;
    sellingPoints: string[];
    channel: string;
  };
  output: CopyOutput;
  channel: string;
  status: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// ============================================================
// 通用 API 请求函数
// ============================================================
async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    return await res.json();
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "网络错误，请重试",
    };
  }
}

export default function GeneratePage() {
  // ----- 用户信息 -----
  const { user } = useAuth();

  // ----- 生成相关状态 -----
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<CopyOutput | null>(null);
  const [channelLabel, setChannelLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ----- 历史记录相关状态 -----
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // ----- 用户套餐信息 -----
  const [userProfile, setUserProfile] = useState<{
    plan: string;
    todayUsage: number;
    dailyLimit: number | null;
  } | null>(null);

  // ============================================================
  // 页面加载时获取历史记录
  // ============================================================
  useEffect(() => {
    async function fetchHistory() {
      setHistoryLoading(true);
      setHistoryError(null);

      const result = await apiRequest<GenerationRecord[]>("/api/generations?limit=10");

      if (result.error) {
        setHistoryError(result.error);
      } else {
        setHistory(result.data || []);
      }

      setHistoryLoading(false);
    }

    fetchHistory();
  }, []);

  // 页面加载时获取用户套餐
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const result = await res.json();
        if (result.data) {
          setUserProfile(result.data);
        }
      } catch {
        // 默认 free
      }
    }
    fetchProfile();
  }, []);

  // ============================================================
  // 点击"生成文案"按钮时调用
  // ============================================================
  const handleGenerate = useCallback(async (data: CopyFormData) => {
    setGenerating(true);
    setOutput(null);
    setError(null);
    setChannelLabel(
      COPY_CHANNELS.find((c) => c.value === data.channel)?.label || ""
    );

    const result = await apiRequest<{
      id: string;
      input: any;
      output: CopyOutput;
      status: string;
    }>("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        productName: data.productName,
        productDescription: data.productDescription,
        targetAudience: data.targetAudience,
        sellingPoints: data.sellingPoints,
        channel: data.channel,
      }),
    });

    if (result.error) {
      setError(result.error);
      setGenerating(false);
      return;
    }

    if (result.data?.output) {
      setOutput(result.data.output);
    }

    setGenerating(false);

    // 刷新历史记录
    const historyResult = await apiRequest<GenerationRecord[]>("/api/generations?limit=10");
    if (historyResult.data) {
      setHistory(historyResult.data);
    }
  }, []);

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <AppSidebar
          userName={user?.email?.split("@")[0] || "用户"}
          userPlan={userProfile?.plan || "free"}
          usageLabel={
            userProfile?.plan === "pro"
              ? "不限次数"
              : "今日已用 " + (userProfile?.todayUsage || 0) + "/3 次"
          }
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader
            title="生成工作台"
            description="输入产品信息，AI 帮你生成多版本营销文案"
          />

          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* ===== 左侧：表单 + 历史记录 ===== */}
              <div className="lg:col-span-2 space-y-6">
                {/* 生成表单 */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                  <CopyForm
                    onSubmit={handleGenerate}
                    isGenerating={generating}
                  />
                </div>

                {/* 错误提示 */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* ===== 历史记录面板 ===== */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    最近生成记录
                  </h3>

                  {/* 加载中 */}
                  {historyLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
                        <p className="text-xs text-gray-400">加载中...</p>
                      </div>
                    </div>
                  )}

                  {/* 加载失败 */}
                  {historyError && !historyLoading && (
                    <div className="text-center py-8">
                      <p className="text-xs text-red-500">{historyError}</p>
                    </div>
                  )}

                  {/* 空状态 */}
                  {!historyLoading && !historyError && history.length === 0 && (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">还没有生成记录</p>
                      <p className="text-xs text-gray-300 mt-1">在左侧填写产品信息开始生成</p>
                    </div>
                  )}

                  {/* 有历史记录 */}
                  {!historyLoading && !historyError && history.length > 0 && (
                    <div className="space-y-3">
                      {history.map((record) => (
                        <div
                          key={record.id}
                          className="rounded-lg border border-gray-100 p-3 hover:border-gray-200 transition-colors cursor-pointer"
                          onClick={() => {
                            if (record.output) {
                              setOutput(record.output);
                              setChannelLabel(
                                COPY_CHANNELS.find(
                                  (c) => c.value === record.channel
                                )?.label || ""
                              );
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {record.input.productName}
                            </p>
                            <span className="text-xs text-gray-400 shrink-0 ml-2">
                              {new Date(record.createdAt).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {record.input.productDescription || "暂无描述"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ===== 右侧：生成结果 ===== */}
              <div className="lg:col-span-3">
                <ResultPanel
                  output={output}
                  isGenerating={generating}
                  channelLabel={channelLabel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
