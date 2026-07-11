# Dashboard (生成工作台) Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the AI copy generation dashboard with structured form inputs (product name, description, audience, 3 selling points, Chinese marketing channels) and structured multi-format output (headline, subtitle, CTA, 3 short copies, long copy) using mock data.

**Architecture:** Add `CopyOutput` and `CopyChannel` types to shared package. Create reusable `CopyForm` (left form panel) and `ResultPanel` (right output panel) components in `packages/ui/src/generate/`. The generate page composes them in a 2/5 + 3/5 responsive grid. Mock generation returns channel-specific structured data after a 1.5 s simulated delay.

**Tech Stack:** Next.js 14.2 App Router, TypeScript, Tailwind CSS 3.4, Lucide React 0.400, @ai-copy/ui, @ai-copy/shared

---

### Task 1: Add structured copy types to shared package

**Files:**
- Modify: `packages/shared/src/types.ts`

- [ ] **Step 1: Add CopyOutput interface and CopyChannel type to types.ts**

Insert after the `OutputType` line (after `export type OutputType = "headline" | "body" | "cta" | "full";`, around line 37):

```typescript
/* ====== 结构化文案输出 ====== */
export type CopyChannel = "website" | "moments" | "xiaohongshu" | "douyin" | "email";

export const COPY_CHANNELS: { value: CopyChannel; label: string }[] = [
  { value: "website", label: "官网" },
  { value: "moments", label: "朋友圈" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "douyin", label: "抖音" },
  { value: "email", label: "邮件" },
];

export interface CopyFormData {
  productName: string;
  productDescription: string;
  targetAudience: string;
  sellingPoints: [string, string, string];
  channel: CopyChannel;
}

export interface CopyOutput {
  headline: string;
  subtitle: string;
  cta: string;
  shortCopies: [string, string, string];
  longCopy: string;
}
```

- [ ] **Step 2: Verify build**

Run: `cd "F:/ai business/ai-copy-saas" && pnpm build`
Expected: Build succeeds

---

### Task 2: Add mock structured copy data

**Files:**
- Modify: `packages/shared/src/mock-data.ts`

- [ ] **Step 1: Add MOCK_COPY_OUTPUTS and generateMockCopyOutput**

Add after the `MOCK_USER_PLAN_INFO` block (after line ~320). Also add the import for `CopyChannel` at the top (replace the existing single-line import with a multi-line import that includes the new types):

First, update the import at the top of `mock-data.ts` (line 1-6). Change:

```typescript
import type {
  User, Plan, GenerationRecord, GenerationInput, BillingRecord,
  AdminOverview, FAQItem, Feature, GenerationChannel, GenerationTone,
  OutputType, GenerationStatus, OrderStatus, UserPlan, UserStatus,
} from "./types";
```

To:

```typescript
import type {
  User, Plan, GenerationRecord, GenerationInput, BillingRecord,
  AdminOverview, FAQItem, Feature, GenerationChannel, GenerationTone,
  OutputType, GenerationStatus, OrderStatus, UserPlan, UserStatus,
  CopyOutput, CopyChannel,
} from "./types";
```

Then add at the end of the file, after `MOCK_USER_PLAN_INFO`:

```typescript
/* ====== 结构化文案生成 Mock ====== */

export const MOCK_COPY_OUTPUTS: Record<CopyChannel, CopyOutput> = {
  website: {
    headline: "智能运动手环 Pro — 你的 24 小时健康管家",
    subtitle: "AI 精准分析每一次心跳，让运动更科学、更高效",
    cta: "限时首发价 ¥299 · 立即抢购 →",
    shortCopies: [
      "心率监测 · 睡眠分析 · 50 米防水，一款手环满足全天候健康需求。",
      "告别盲目运动！AI 教练实时指导，科学训练计划助你突破瓶颈。",
      "时尚外观 + 硬核功能，从健身房到办公室，全天佩戴无压力。",
    ],
    longCopy:
      "你是否还在凭感觉运动？智能运动手环 Pro 内置第六代 AI 心率算法，实时监测你的运动状态，自动调整训练强度。\n\n产品亮点：\n• AI 智能分析：专业级心率算法，准确率高达 97%\n• 50 米防水：游泳、淋浴无需摘取\n• 14 天超长续航：一次充电，两周无忧\n\n前 1000 名下单用户享首发折扣价 ¥299（原价 ¥499），点击上方按钮立即购买！",
  },
  moments: {
    headline: "🔥 运动达人都偷偷入手了这款手环",
    subtitle: "AI 教练 + 心率监测 + 50 米防水，居然才 ¥299",
    cta: "戳我抢购 →",
    shortCopies: [
      "每天坐着办公腰部酸痛？试试这款能提醒你站起来走走的智能手环！",
      "朋友圈都问我最近气色怎么这么好——其实是睡得好，手环帮我优化作息。",
      "健身房教练都夸我训练效率高，秘密武器就是手腕上这个小玩意儿。",
    ],
    longCopy:
      "最近入手了智能运动手环 Pro，用了一周真的后悔没早买！\n\n❤️ 最喜欢的功能：\n1. 久坐提醒——每个小时震动一下，再也不怕一坐就是半天\n2. 睡眠分析——原来我深度睡眠一直不够，调整作息后白天精神好多了\n3. 心率监测——跑步时实时看心率区间，科学调整配速\n\n而且只要 ¥299，少喝几杯奶茶就能拥有！链接放在下面了👇",
  },
  xiaohongshu: {
    headline: "小众但超实用的健康好物｜打工人必备手环",
    subtitle: "¥299 拿下 AI 智能手环，真香警告 ⚠️",
    cta: "点击链接 Get 同款 ✨",
    shortCopies: [
      "💪 健身小白也能用！AI 自动生成训练计划，不用请私教了",
      "📊 24 小时心率监测 + 压力指数，数据在手环上一目了然",
      "💤 睡眠质量差星人必入！手环帮你分析深浅睡眠比例",
    ],
    longCopy:
      "来分享一个最近发现的宝藏好物✨\n\n作为一个长期久坐的打工人，一直想入手一个手环来监测健康。对比了好几款，最后选了智能运动手环 Pro，用了两周来交作业！\n\n外观：⭐️⭐️⭐️⭐️⭐️\n简约设计，表带亲肤，戴着睡觉也无感\n\n功能：⭐️⭐️⭐️⭐️⭐️\nAI 心率监测、睡眠分析、久坐提醒、50 米防水…该有的全都有\n\n续航：⭐️⭐️⭐️⭐️\n充一次用两周，出差不用带充电器\n\n价格：⭐️⭐️⭐️⭐️⭐️\n¥299 这个价位真的无敌了\n\n姐妹们冲就完了！👇\n\n#智能手环 #健康好物 #运动装备 #打工人必备",
  },
  douyin: {
    headline: "只要 299？这款 AI 手环把千元级功能打下来了！",
    subtitle: "心率监测 + 睡眠分析 + 50 米防水，性价比天花板",
    cta: "点击左下角，马上抢购！",
    shortCopies: [
      "家人们谁懂啊！299 买到了千元级智能手环，这波真的赚到了！",
      "跑步、游泳、健身全都 hold 住，AI 教练比私教还贴心！",
      "续航 14 天不用充电，出差党狂喜！点击下方链接上车！",
    ],
    longCopy:
      "今天给大家测评一款最近超火的智能运动手环 Pro👇\n\n先说价格：只要 ¥299！你没看错！\n\n功能有多强？\n⚡ AI 智能心率算法——专业级监测，准确率 97%\n🏊 50 米防水——游泳洗澡都不用摘\n🔋 14 天超长续航——充一次用两周\n📊 睡眠分析——帮你改善睡眠质量\n\n颜值也在线！简约设计，三种颜色可选：曜石黑、陶瓷白、珊瑚粉\n\n不管是送自己还是送爸妈都超合适！\n\n💥 限时福利：前 1000 名下单再送运动臂带！\n\n左下角小黄车，手慢无！",
  },
  email: {
    headline: "智能运动手环 Pro 正式发布 — 首发特惠 ¥299",
    subtitle: "AI 驱动健康管理，让每一次运动都更有价值",
    cta: "立即购买，享首发折扣",
    shortCopies: [
      "尊敬的客户，智能运动手环 Pro 现已正式开售。前 1000 名下单享 ¥299 首发价。",
      "AI 心率监测、睡眠分析、14 天续航——一款重新定义入门手环的产品。",
      "限时优惠中，点击下方按钮立即抢购，7 天无理由退换。",
    ],
    longCopy:
      "亲爱的用户，\n\n感谢你对智能运动手环 Pro 的关注！我们很高兴地通知你，产品现已正式开售。\n\n智能运动手环 Pro 是专为追求健康生活的你打造的全天候健康伴侣：\n\n• AI 心率算法：第六代 PPG 传感器，实时精准监测\n• 智能睡眠分析：识别深睡/浅睡/REM 三个阶段\n• 50 米防水：游泳、淋浴、雨中跑步全场景适用\n• 14 天超长续航：典型场景下续航长达两周\n• 全天候佩戴：轻至 25g，亲肤表带，佩戴无感\n\n限时首发价 ¥299（原价 ¥499），前 1000 名下单额外赠送运动臂带。\n\n立即购买：[链接]\n\n智能运动手环 Pro 团队",
  },
};

export function generateMockCopyOutput(channel: CopyChannel): CopyOutput {
  return MOCK_COPY_OUTPUTS[channel];
}
```

- [ ] **Step 2: Verify build**

Run: `cd "F:/ai business/ai-copy-saas" && pnpm build`
Expected: Build succeeds

---

### Task 3: Create CopyForm component (left panel)

**Files:**
- Create: `packages/ui/src/generate/CopyForm.tsx`
- Create: `packages/ui/src/generate/index.ts`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Create CopyForm.tsx**

```tsx
"use client";
import React, { useState } from "react";
import { COPY_CHANNELS, type CopyChannel, type CopyFormData } from "@ai-copy/shared";
import { Wand2 } from "lucide-react";

interface CopyFormProps {
  onSubmit: (data: CopyFormData) => void;
  isGenerating: boolean;
}

const INITIAL_FORM: CopyFormData = {
  productName: "",
  productDescription: "",
  targetAudience: "",
  sellingPoints: ["", "", ""],
  channel: "website" as CopyChannel,
};

export function CopyForm({ onSubmit, isGenerating }: CopyFormProps) {
  const [form, setForm] = useState<CopyFormData>(INITIAL_FORM);

  const updateField = <K extends keyof CopyFormData>(
    key: K,
    value: CopyFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSellingPoint = (index: number, value: string) => {
    const points = [...form.sellingPoints] as [string, string, string];
    points[index] = value;
    setForm((prev) => ({ ...prev, sellingPoints: points }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      alert("请输入产品名称");
      return;
    }
    onSubmit(form);
  };

  const inputClass =
    "block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors placeholder:text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 产品名称 */}
      <div>
        <label className={labelClass}>
          产品名 <span className="text-red-400">*</span>
        </label>
        <input
          value={form.productName}
          onChange={(e) => updateField("productName", e.target.value)}
          className={inputClass}
          placeholder="例如：智能运动手环 Pro"
        />
      </div>

      {/* 一句话介绍 */}
      <div>
        <label className={labelClass}>一句话介绍</label>
        <input
          value={form.productDescription}
          onChange={(e) => updateField("productDescription", e.target.value)}
          className={inputClass}
          placeholder="例如：一款 AI 驱动的 24 小时健康监测智能手环"
        />
      </div>

      {/* 目标用户 */}
      <div>
        <label className={labelClass}>目标用户</label>
        <input
          value={form.targetAudience}
          onChange={(e) => updateField("targetAudience", e.target.value)}
          className={inputClass}
          placeholder="例如：25-40 岁都市白领、健身爱好者"
        />
      </div>

      {/* 3个卖点 */}
      <div>
        <label className={labelClass}>
          核心卖点{" "}
          <span className="text-xs font-normal text-gray-400">
            （最多 3 个）
          </span>
        </label>
        <div className="space-y-2">
          {form.sellingPoints.map((point, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                {i + 1}
              </span>
              <input
                value={point}
                onChange={(e) => updateSellingPoint(i, e.target.value)}
                className={inputClass}
                placeholder={
                  ["AI 智能分析心率", "50 米防水等级", "14 天超长续航"][i]
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* 投放渠道 */}
      <div>
        <label className={labelClass}>投放渠道</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COPY_CHANNELS.map((ch) => (
            <button
              key={ch.value}
              type="button"
              onClick={() => updateField("channel", ch.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                form.channel === ch.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            AI 生成中...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            生成文案
          </>
        )}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create barrel index.ts for generate components**

Create `packages/ui/src/generate/index.ts`:

```typescript
export { CopyForm } from "./CopyForm";
```

- [ ] **Step 3: Export CopyForm from ui index.ts**

Add to `packages/ui/src/index.ts` (after the marketing section, before the final closing):

```typescript
// Generate
export { CopyForm } from "./generate/CopyForm";
```

- [ ] **Step 4: Verify build**

Run: `cd "F:/ai business/ai-copy-saas" && pnpm build`
Expected: Build succeeds

---

### Task 4: Create ResultPanel component (right panel)

**Files:**
- Create: `packages/ui/src/generate/ResultPanel.tsx`
- Modify: `packages/ui/src/generate/index.ts`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Create ResultPanel.tsx**

```tsx
"use client";
import React, { useState } from "react";
import type { CopyOutput } from "@ai-copy/shared";
import { Wand2, Copy, Check, Sparkles } from "lucide-react";

interface ResultPanelProps {
  output: CopyOutput | null;
  isGenerating: boolean;
  channelLabel?: string;
}

export function ResultPanel({
  output,
  isGenerating,
  channelLabel,
}: ResultPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback for insecure contexts
      alert("已复制到剪贴板（当前环境限制，请手动复制）");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">生成结果</span>
          {channelLabel && (
            <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
              {channelLabel}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-auto">
        {isGenerating ? (
          /* ====== Loading State ====== */
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-primary-100 border-t-primary-600 animate-spin" />
              <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-primary-400" />
            </div>
            <p className="mt-5 text-sm font-medium text-gray-500">
              AI 正在生成营销文案...
            </p>
            <p className="mt-1 text-xs text-gray-400">
              正在分析产品信息与投放渠道
            </p>
          </div>
        ) : output ? (
          /* ====== Result State ====== */
          <div className="space-y-6">
            {/* 主标题 */}
            <SectionCard
              title="主标题"
              onCopy={() => handleCopy(output.headline, "headline")}
              copied={copiedKey === "headline"}
            >
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {output.headline}
              </h2>
            </SectionCard>

            {/* 副标题 */}
            <SectionCard
              title="副标题"
              onCopy={() => handleCopy(output.subtitle, "subtitle")}
              copied={copiedKey === "subtitle"}
            >
              <p className="text-base text-gray-600 leading-relaxed">
                {output.subtitle}
              </p>
            </SectionCard>

            {/* CTA */}
            <SectionCard
              title="行动号召 (CTA)"
              onCopy={() => handleCopy(output.cta, "cta")}
              copied={copiedKey === "cta"}
              highlight
            >
              <p className="text-base font-semibold text-primary-600">
                {output.cta}
              </p>
            </SectionCard>

            {/* 3版短文案 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  短文案（3 版）
                </h3>
              </div>
              <div className="grid gap-3">
                {output.shortCopies.map((copy, i) => (
                  <div
                    key={i}
                    className="group relative rounded-lg border border-gray-100 bg-gray-50/50 p-4 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary-100 text-xs font-medium text-primary-700">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed pr-6">
                        {copy}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(copy, `short-${i}`)}
                      className="absolute top-2 right-2 rounded p-1.5 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-primary-500 hover:bg-white transition-all"
                      title="复制"
                    >
                      {copiedKey === `short-${i}` ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 长文案 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  长文案
                </h3>
                <button
                  onClick={() => handleCopy(output.longCopy, "long")}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:text-primary-500 hover:bg-gray-50 transition-colors"
                >
                  {copiedKey === "long" ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedKey === "long" ? "已复制" : "复制"}
                </button>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <p className="text-sm text-gray-700 leading-7 whitespace-pre-line">
                  {output.longCopy}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ====== Empty State ====== */
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
              <Wand2 className="h-7 w-7 text-primary-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              等待生成文案
            </p>
            <p className="mt-1 text-xs text-gray-400">
              填写左侧表单，点击"生成文案"按钮
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== SectionCard sub-component ====== */

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  onCopy: () => void;
  copied: boolean;
  highlight?: boolean;
}

function SectionCard({
  title,
  children,
  onCopy,
  copied,
  highlight,
}: SectionCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-primary-200 bg-primary-50/30"
          : "border-gray-100 bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </h3>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:text-primary-500 hover:bg-white transition-colors"
          title="复制"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Export ResultPanel from barrel**

Update `packages/ui/src/generate/index.ts`:

```typescript
export { CopyForm } from "./CopyForm";
export { ResultPanel } from "./ResultPanel";
```

- [ ] **Step 3: Export ResultPanel from ui index.ts**

Update `packages/ui/src/index.ts` (the generate section):

```typescript
// Generate
export { CopyForm } from "./generate/CopyForm";
export { ResultPanel } from "./generate/ResultPanel";
```

- [ ] **Step 4: Verify build**

Run: `cd "F:/ai business/ai-copy-saas" && pnpm build`
Expected: Build succeeds

---

### Task 5: Rewrite generate page

**Files:**
- Modify: `apps/app/app/generate/page.tsx`

- [ ] **Step 1: Replace generate/page.tsx**

Replace the entire file content:

```tsx
"use client";
import React, { useState, useCallback } from "react";
import {
  AppSidebar,
  AppHeader,
  CopyForm,
  ResultPanel,
} from "@ai-copy/ui";
import {
  MOCK_USER_PLAN_INFO,
  COPY_CHANNELS,
  generateMockCopyOutput,
} from "@ai-copy/shared";
import type { CopyFormData, CopyOutput } from "@ai-copy/shared";

export default function GeneratePage() {
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<CopyOutput | null>(null);
  const [channelLabel, setChannelLabel] = useState("");

  const handleGenerate = useCallback((data: CopyFormData) => {
    setGenerating(true);
    setOutput(null);
    setChannelLabel(
      COPY_CHANNELS.find((c) => c.value === data.channel)?.label || ""
    );

    // Simulate 1.5s generation delay
    setTimeout(() => {
      setOutput(generateMockCopyOutput(data.channel));
      setGenerating(false);
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen">
      <AppSidebar
        userName="用户"
        userPlan="free"
        usageLabel={MOCK_USER_PLAN_INFO.free.label}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="生成工作台"
          description="输入产品信息，AI 帮你生成多版本营销文案"
        />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* 左侧表单 — 占 2/5 */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                <CopyForm
                  onSubmit={handleGenerate}
                  isGenerating={generating}
                />
              </div>
            </div>
            {/* 右侧结果 — 占 3/5 */}
            <div className="lg:col-span-3">
              <ResultPanel
                output={output}
                isGenerating={generating}
                channelLabel={channelLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd "F:/ai business/ai-copy-saas" && pnpm build`
Expected: Build succeeds

---

### Task 6: Final verification

**Files:**
- Full project build check

- [ ] **Step 1: Complete build verification**

Run: `cd "F:/ai business/ai-copy-saas" && pnpm build 2>&1`

Expected output: All 3 apps (www, app, admin) compile successfully with zero errors.

Check for routes:
- `apps/app` should have: `/`, `/_not-found`, `/billing`, `/generate`, `/history`, `/login`, `/register` (7 routes)
- First Load JS shared by all should remain ~87.3 kB (no new shared deps added)

---

## Self-Review

### 1. Spec Coverage
- ✅ **Left form**: 产品名, 一句话介绍, 目标用户, 3 个卖点 (numbered inputs), 投放渠道 (5 toggle buttons with 官网/朋友圈/小红书/抖音/邮件)
- ✅ **Right results**: 主标题, 副标题, CTA (highlighted), 3 版短文案 (numbered cards), 长文案 (text block)
- ✅ **Mock data**: Channel-specific outputs for all 5 channels with distinct tones (官网=professional, 朋友圈=casual, 小红书=lifestyle, 抖音=energetic, 邮件=formal)
- ✅ **Loading state**: Animated spinner + "AI 正在生成营销文案..." message
- ✅ **Empty state**: Wand2 icon in primary-50 circle + "等待生成文案" / "填写左侧表单，点击"生成文案"按钮"
- ✅ **Responsive**: 1-column on mobile stack, 2/5 + 3/5 grid on lg+, channel buttons use 2-col → 3-col grid

### 2. Placeholder Scan
- No TBD, TODO, placeholder, or "add later" markers
- Every step has complete code blocks with exact file content
- All file paths are exact repo-relative paths
- Exact commands with expected outcomes

### 3. Type Consistency
- `CopyOutput` interface used consistently in: types.ts (definition), mock-data.ts (generation), ResultPanel.tsx (props/state), page.tsx (state)
- `CopyChannel` type used in: types.ts (definition), mock-data.ts (mock output records), CopyForm.tsx (channel selector), page.tsx (lookup)
- `CopyFormData` used in: types.ts (definition), CopyForm.tsx (form state & props), page.tsx (callback parameter)
- `generateMockCopyOutput(channel: CopyChannel): CopyOutput` — return type matches interface
- SectionCard `copied` prop is `boolean`, `onCopy` is `() => void` — matches usage across all 4 SectionCard instances
