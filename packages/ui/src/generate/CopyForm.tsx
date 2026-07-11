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

      <div>
        <label className={labelClass}>一句话介绍</label>
        <input
          value={form.productDescription}
          onChange={(e) => updateField("productDescription", e.target.value)}
          className={inputClass}
          placeholder="例如：一款 AI 驱动的 24 小时健康监测智能手环"
        />
      </div>

      <div>
        <label className={labelClass}>目标用户</label>
        <input
          value={form.targetAudience}
          onChange={(e) => updateField("targetAudience", e.target.value)}
          className={inputClass}
          placeholder="例如：25-40 岁都市白领、健身爱好者"
        />
      </div>

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
