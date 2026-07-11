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
