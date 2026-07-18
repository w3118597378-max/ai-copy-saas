"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@ai-copy/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(searchParams.get("registered") === "1" ? "注册成功！请使用你的邮箱和密码登录" : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await signIn(email, password);

    if (err) {
      // 中文错误提示
      if (err.includes("Invalid login credentials")) {
        setError("邮箱或密码错误");
      } else if (err.includes("Email not confirmed")) {
        setError("邮箱未验证，请检查收件箱");
      } else {
        setError(err);
      }
      setLoading(false);
    } else {
      // 登录成功，跳转到工作台
      router.push("/generate");
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900">欢迎回来</h1>
          <p className="mt-2 text-gray-500">登录你的账户继续使用</p>
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
                placeholder="......"
                required
              />
            </div>

            {/* 成功提示 */}
            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            还没有账户？{" "}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              免费注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white">
        <p className="text-gray-500">加载中...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
