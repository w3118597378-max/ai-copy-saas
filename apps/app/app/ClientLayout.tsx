"use client";
import React from "react";
import { AuthProvider } from "@ai-copy/ui";

/**
 * Client-only wrapper，提供 AuthProvider 全局登录状态。
 * 必须在 layout.tsx 里被引用。
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
