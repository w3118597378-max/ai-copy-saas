"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@ai-copy/shared";

/* ——— 用户信息类型（简化版，只存登录需要的字段） ——— */
export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  /** 当前登录用户，null 表示未登录 */
  user: AuthUser | null;
  /** 是否正在检查登录状态（首次加载时） */
  loading: boolean;
  /** 邮箱+密码 登录 */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** 邮箱+密码 注册 */
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  /** 退出登录 */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 1. 检查当前是否有登录 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
      }
      setLoading(false);
    });

    // 2. 监听登录状态变化（比如别处登出了，这里自动更新）
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
      } else {
        setUser(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const supabase = createClient();
    const appUrl = typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message, needsEmailConfirmation: false };
    }

    // 如果注册成功但没有 session，说明 Supabase 开启了邮箱验证
    // 用户需要去邮箱里点确认链接
    if (data?.user && !data.session) {
      return { error: null, needsEmailConfirmation: true };
    }

    return { error: null, needsEmailConfirmation: false };
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 在组件里获取登录状态的 Hook
 *
 * 用法：
 *   const { user, signIn, signOut } = useAuth()
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 里面使用");
  return ctx;
}
