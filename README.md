<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/CopyAI-AI%20营销文案生成平台-8B5CF6?style=for-the-badge&logo=openai&logoColor=white">
    <img alt="CopyAI" src="https://img.shields.io/badge/CopyAI-AI%20营销文案生成平台-8B5CF6?style=for-the-badge&logo=openai&logoColor=white">
  </picture>
</p>

<p align="center">
  <a href="https://ai-copy-www.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/在线演示-营销官网-8B5CF6?style=flat-square" alt="Demo">
  </a>
  <img src="https://img.shields.io/badge/Next.js-14-000?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-FFCA28?style=flat-square&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe" alt="Stripe">
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo" alt="Turborepo">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License">
</p>

<div align="center">
  <h3>🚀 AI 驱动的多渠道中文营销文案生成平台</h3>
  <p>输入产品信息，AI 秒级生成适配官网 · 小红书 · 抖音 · 朋友圈 · 邮件的营销文案</p>
  <p><strong>技术栈:</strong> Next.js 14 · Supabase · Stripe · DeepSeek · pnpm · Turborepo</p>
</div>

---

## 📸 核心页面

<!-- TODO: 替换为实际截图链接 -->

| 页面 | 截图 | 说明 |
|------|------|------|
| **营销官网** (www) | `[截图待补充]` | 首页、功能展示、定价方案、FAQ |
| **生成工作台** (app) | `[截图待补充]` | 产品信息表单 + AI 生成结果展示 |
| **套餐管理** (app) | `[截图待补充]` | 套餐查看、升级、支付、订阅管理 |
| **历史记录** (app) | `[截图待补充]` | 生成记录查看、筛选、复用 |
| **管理后台** (admin) | `[截图待补充]` | 用户列表、生成记录、订阅状态总览 |

> 在线演示：[营销官网](https://ai-copy-www.vercel.app)

---

## ✨ 核心功能

### 🎯 AI 文案生成
输入产品名称、一句话介绍、目标用户、三个核心卖点，选择投放渠道，AI 自动生成完整营销文案包：

| 输出内容 | 说明 |
|----------|------|
| **主标题** | 吸引眼球的标题 |
| **副标题** | 补充说明，增强说服力 |
| **CTA 行动号召** | 引导用户点击/购买 |
| **3 版短文案** | 适配社媒传播的简短文案 |
| **长文案** | 详细的产品介绍与卖点展开 |

### 📢 多渠道适配
同一产品信息，AI 自动生成适配不同平台调性的文案：

| 渠道 | 风格 | 示例场景 |
|------|------|----------|
| 官网 `website` | 专业可信 | 产品落地页 |
| 朋友圈 `moments` | 亲和真实 | 微信朋友圈分享 |
| 小红书 `xiaohongshu` | 种草推荐 | 小红书笔记 |
| 抖音 `douyin` | 冲动转化 | 短视频带货文案 |
| 邮件 `email` | 正式商务 | 营销邮件 |

### 🔐 用户系统
- 邮箱密码注册 / 登录
- 邮箱确认验证
- ProtectedRoute 页面保护
- 基于套餐的使用限制（Free: 3次/日，Pro: 无限）

### 💳 付费订阅
- **Free** 套餐：免费使用，每日 3 次生成
- **Pro 月付**：¥79/月，无限生成
- **Pro 年付**：¥788/年（省 17%）
- 通过 Stripe Checkout 安全支付
- 通过 Stripe Customer Portal 管理订阅（升级/降级/取消）

---

## 🏗️ 项目架构

### Monorepo 结构

```
ai-copy-saas/
├── apps/
│   ├── www/          # 营销官网 (port 3000)
│   │   ├── app/      # Hero, Features, Pricing, FAQ
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── app/          # 主应用 (port 3001)
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── generate/       → DeepSeek API
│   │   │   │   ├── stripe/         → Checkout / Webhook / Portal
│   │   │   │   └── user/           → Profile
│   │   │   ├── auth/callback/      → 邮箱确认回调
│   │   │   ├── generate/           → 生成工作台
│   │   │   ├── history/            → 历史记录
│   │   │   ├── billing/            → 套餐管理
│   │   │   └── login|register/     → 认证
│   │   └── package.json
│   │
│   └── admin/        # 管理后台 (port 3002)
│       └── app/
│           └── api/admin/          → 用户/生成/订阅管理
│
├── packages/
│   ├── ui/           # 组件库
│   │   ├── src/
│   │   │   ├── auth/              # AuthProvider, useAuth
│   │   │   ├── layout/            # Header, Sidebar, Footer
│   │   │   ├── marketing/         # Hero, Features, Pricing, FAQ, CTA
│   │   │   ├── generate/          # CopyForm, ResultPanel
│   │   │   └── UI atoms           # Button, Card, Badge, Table, Tabs
│   │   └── package.json
│   │
│   └── shared/       # 共享类型 + Mock 数据 + 数据库迁移
│       ├── src/                   # 类型定义
│       ├── supabase/migrations/   # SQL 迁移脚本
│       └── package.json
│
├── PRD.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### 数据流架构

```
用户 (浏览器)
  │
  ├── 登录/注册 ──→ Supabase Auth ──→ Supabase DB (PostgreSQL)
  │
  ├── 生成文案 ──→ Route Handler (/api/generate)
  │                   │
  │                   └──→ DeepSeek API (OpenAI 兼容接口)
  │                           │
  │                           └──→ 返回结构化 JSON 文案
  │
  └── 支付订阅 ──→ Route Handler (/api/stripe/*)
                      │
                      ├──→ Stripe Checkout (支付页面)
                      │
                      └──→ Stripe Webhook → 更新 Supabase (套餐状态)
```

---

## 🛠️ 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Next.js (App Router) | ^14.2 | 全栈 Web 框架 |
| 语言 | TypeScript | ^5.4 | 类型安全 |
| 样式 | Tailwind CSS | ^3.4 | 原子化 CSS 框架 |
| 图标 | Lucide React | ^0.400 | SVG 图标库 |
| 包管理 | pnpm | ^9.0 | 快速、磁盘高效的包管理 |
| Monorepo | Turborepo | ^2.0 | 增量构建与任务编排 |
| 数据库 | Supabase (PostgreSQL) | — | 关系型数据库 + RLS |
| 认证 | Supabase Auth | — | 邮箱密码 + Session |
| 客户端 | @supabase/ssr | ^0.5 | SSR 兼容的 Supabase 客户端 |
| 支付 | Stripe SDK | ^17.0 | Checkout + 订阅管理 |
| AI | DeepSeek API | — | OpenAI 兼容的文案生成 |
| 部署 | Vercel | — | 云托管与自动部署 |

---

## 🚀 本地启动

### 前置条件

| 服务 | 用途 | 注册地址 |
|------|------|----------|
| **Supabase** | 数据库 + 用户认证 | https://supabase.com/dashboard |
| **Stripe** | 支付处理 | https://dashboard.stripe.com/register |
| **DeepSeek** | AI 文案生成 | https://platform.deepseek.com |
| **Node.js 20+** | 运行环境 | https://nodejs.org |
| **pnpm 9+** | 包管理 | `npm install -g pnpm` |
| **Stripe CLI** | 本地 Webhook 调试 | https://stripe.com/docs/stripe-cli |

### 1. 克隆安装

```bash
git clone <your-repo-url>
cd ai-copy-saas
pnpm install
```

### 2. 配置环境变量

为每个 app 创建 `.env.local`：

```bash
# 主应用（必须配置全部 9 个变量）
cp apps/app/.env.example apps/app/.env.local

# 管理后台（只需 Supabase 三个变量）
cp apps/admin/.env.example apps/admin/.env.local

# 营销官网（当前只需 APP_URL）
cp apps/www/.env.example apps/www/.env.local
```

| 变量 | 说明 | 来源 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名公钥 | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端密钥（绕过 RLS） | 同上 |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | DeepSeek 开放平台 → API Keys |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook 签名密钥 | Stripe Dashboard → Webhooks |
| `STRIPE_PRICE_PRO_MONTHLY` | Pro 月付价格 ID | Stripe Dashboard → Products |
| `STRIPE_PRICE_PRO_YEARLY` | Pro 年付价格 ID | Stripe Dashboard → Products |
| `NEXT_PUBLIC_APP_URL` | 应用域名 | 开发: `http://localhost:3001`，生产: 实际域名 |

### 3. 初始化数据库

在 Supabase Dashboard → SQL Editor 中依次执行：

1. `packages/shared/supabase/migrations/001_create_generation_records.sql`
2. `packages/shared/supabase/migrations/002_create_profiles_subscriptions.sql`
3. `packages/shared/supabase/migrations/003_create_billing_records.sql`
4. `packages/shared/supabase/migrations/004_add_billing_cycle_role.sql`

然后配置 Supabase → Authentication → Settings：

- **邮箱确认**: 开启
- **Site URL**: `http://localhost:3001`
- **Redirect URLs**: 添加 `http://localhost:3001/auth/callback`

### 4. 启动开发服务器

```bash
# 启动全部 3 个 app
pnpm dev

# 或单独启动某个
pnpm dev:www    # → http://localhost:3000
pnpm dev:app    # → http://localhost:3001
pnpm dev:admin  # → http://localhost:3002
```

### 5. Stripe Webhook 本地调试

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
# 复制终端显示的 Webhook Signing Secret 到 STRIPE_WEBHOOK_SECRET
```

---

## 🌐 部署

### Vercel 部署（推荐）

3 个 app 作为独立的 Vercel 项目分别部署。所有项目从 monorepo 根目录导入。

**Vercel 项目配置（每个 app 通用）**：

| 配置项 | 值 |
|--------|-----|
| Root Directory | `.`（monorepo 根目录） |
| Framework | Next.js |
| Build Command | `npx turbo build --filter=@ai-copy/<app>` |
| Output Directory | `apps/<app>/.next` |
| Install Command | `pnpm install` |

**环境变量配置**：

| 项目 | 必须变量 |
|------|----------|
| **ai-copy-www** | `NEXT_PUBLIC_APP_URL` |
| **ai-copy-app** | 全部 9 个变量 |
| **ai-copy-admin** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

### 部署后配置

1. **Supabase Auth URLs**: 在 Supabase Dashboard 配置 Site URL 和 Redirect URLs
2. **Stripe Webhook**: 创建 endpoint 指向 `https://your-domain.com/api/stripe/webhook`
3. **密钥轮换**: 部署前重新生成所有 API 密钥

---

## 📋 环境变量清单

<details>
<summary>点击展开完整清单</summary>

### apps/app/.env.local（全部 9 个变量）

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# DeepSeek
DEEPSEEK_API_KEY=sk-your_deepseek_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_PRO_MONTHLY=price_your_monthly_price_id
STRIPE_PRICE_PRO_YEARLY=price_your_yearly_price_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### apps/admin/.env.local（3 个变量）

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### apps/www/.env.local（1 个变量）

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

</details>

---

## 📜 License

MIT © 2026 CopyAI

## 🤝 贡献

欢迎提交 Issue 和 PR！在提交前请确保：

- [ ] 代码通过 TypeScript 类型检查（`pnpm build`）
- [ ] 遵循 monorepo 约定（packages 共享类型/组件）
- [ ] 不包含敏感信息（API key、密码等）
