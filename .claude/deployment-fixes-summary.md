# 部署修复清单

## 已修复的代码问题 ✅

### 1. 🔴 Auth 回调路由（P0）
- **新文件**: `apps/app/app/auth/callback/route.ts`
- 处理 Supabase 邮箱确认后的 code 交换
- 成功后跳转 `/generate`，失败跳转 `/login`

### 2. 🔴 signUp emailRedirectTo（P0）
- **修改**: `packages/ui/src/auth/AuthProvider.tsx`
- 注册时传入 `emailRedirectTo: "{appUrl}/auth/callback"`

### 3. 🟡 Stripe webhook stripe_customer_id（P1）
- **修改**: `apps/app/app/api/stripe/webhook/route.ts`
- `checkout.session.completed` handler 的 profile upsert 中加入 `stripe_customer_id`

### 4. 🟡 README 完善（P1）
- **修改**: `README.md`
- 添加账户前置条件 + 注册链接
- 修复 "你的域名" 占位符 → `your-production-domain.com`
- 添加数据库初始化步骤
- 添加 VPS 生产部署命令（PM2）
- 修复 per-app Vercel 环境变量说明

### 5. 🟡 error.tsx 错误边界（P1）
- **新文件**: 
  - `apps/app/app/error.tsx`（全局）
  - `apps/app/app/generate/error.tsx`
  - `apps/app/app/billing/error.tsx`
  - `apps/app/app/history/error.tsx`

### 6. 🟡 loading.tsx 骨架屏（P1）
- **新文件**:
  - `apps/app/app/generate/loading.tsx`
  - `apps/app/app/billing/loading.tsx`
  - `apps/app/app/history/loading.tsx`
  - `apps/admin/app/loading.tsx`
  - `apps/admin/app/billing/loading.tsx`

### 7. 🟡 billing 静默错误修复（P1）
- **修改**: `apps/app/app/billing/page.tsx`
- 修复 profile fetch 静默失败 → 显示错误提示 + 刷新按钮
- 添加 `profileError` 状态

### 8. 🟢 Vercel 部署配置
- 3 个 app 的 `vercel.json` 简化为标准配置
- Vercel 项目 build command 更新匹配
- 环境变量已全部设置到 Vercel
- `.gitignore` 更新（.env 和 .vercel）

## 仍需手动操作 🔧

| # | 事项 | 操作 |
|---|------|------|
| 1 | **Supabase Auth 回调配置** | Site URL + Redirect URLs 加入 `/auth/callback` |
| 2 | **API 密钥轮换** | Supabase / DeepSeek / Stripe 重新生成密钥 |
| 3 | **Stripe 产品+价格创建** | Dashboard 创建 Pro 月付/年付价格 |
| 4 | **Stripe Webhook 注册** | 添加 endpoint + 订阅 5 个事件 |
| 5 | **Vercel 部署构建** | `cd apps/www && vercel deploy --yes` |
| 6 | **提供生产域名** | 更新 `NEXT_PUBLIC_APP_URL` |
