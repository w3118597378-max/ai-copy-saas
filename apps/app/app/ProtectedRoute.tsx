"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@ai-copy/ui";

/**
 * 包裹需要登录才能访问的页面。
 * 未登录时自动跳转到 /login。
 *
 * 用法：
 *   <ProtectedRoute>
 *     <GeneratePage />
 *   </ProtectedRoute>
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // 正在检查登录状态 — 显示空白或加载提示
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
          <p className="text-sm text-gray-400">检查登录状态...</p>
        </div>
      </div>
    );
  }

  // 未登录 — 不渲染内容（useEffect 会跳转）
  if (!user) {
    return null;
  }

  // 已登录 — 正常显示页面内容
  return <>{children}</>;
}
