"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@ai-copy/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 前端校验
    if (password.length < 6) {
      setError("密码至少需要 6 位字符");
      return;
    }

    setLoading(true);

    try {
      const { error: err, needsEmailConfirmation } = await signUp(email, password);

      if (err) {
        if (err.includes("already registered")) {
          setError("该邮箱已注册，请直接登录");
        } else {
          // 显示原始错误信息，方便排查
          setError(err);
        }
        setLoading(false);
      } else {
        // 注册成功，退出自动登录，让用户手动登录
        await signOut();
        router.push("/login?registered=1");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "注册失败，请检查网络或联系支持");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-bold">C</div>
            <span className="text-2xl font-bold text-gray-900">CopyAI</span>
          </Link>
          <div className="mt-2">
            <a href={process.env.NEXT_PUBLIC_WWW_URL || "http://localhost:3000"} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← 返回官网
            </a>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">创建账户</h1>
          <p className="mt-2 text-gray-500">免费注册，立即开始生成文案</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="至少 6 位字符"
                required
                minLength={6}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "注册中..." : "注册"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            已有账户？{" "}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
