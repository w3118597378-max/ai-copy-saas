import { createBrowserClient } from "@supabase/ssr";

/**
 * 创建 Supabase 浏览器客户端
 *
 * 这个函数用在所有 "use client" 组件里。
 * NEXT_PUBLIC_ 开头的变量会暴露在浏览器端——这是安全的，
 * 因为 Supabase anon key 受 Row Level Security 保护。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
