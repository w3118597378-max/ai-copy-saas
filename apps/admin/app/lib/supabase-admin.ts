// Admin 专用的 Supabase 服务端客户端
// 使用 Service Role Key 绕过 RLS，只用在 admin API 路由中
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
