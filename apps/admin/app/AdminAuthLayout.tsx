"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@ai-copy/ui";
import { createClient } from "@ai-copy/shared";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setIsAdmin(false);
      setCheckingRole(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setCheckingRole(false);
      });
  }, [loading, user]);

  if (loading || checkingRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
          <p className="text-sm text-gray-400">验证身份中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">请先登录后再访问管理后台</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-red-500">无权限访问管理后台</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AdminGuard>{children}</AdminGuard></AuthProvider>;
}
