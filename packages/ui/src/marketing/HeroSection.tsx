import React from "react";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection({ appUrl = "http://localhost:3001" }: { appUrl?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-white" />
      <div className="absolute top-0 right-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm text-primary-700">
            <Sparkles className="h-4 w-4" /> <span>AI 驱动的营销文案生成平台</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            用 AI 生成高质量 <span className="text-primary-600">营销文案</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            输入产品信息和目标受众，秒级生成社交媒体、邮件、落地页、广告等场景的营销文案。
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href={`${appUrl}/register`}>
              <Button size="lg" className="gap-2">免费开始使用 <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="#features"><Button variant="outline" size="lg">了解更多</Button></Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">无需信用卡 · 每日 3 次免费生成</p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-400">CopyAI · 生成工作台</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-10 rounded-lg border border-gray-200 bg-white px-3 flex items-center text-sm text-gray-400">输入产品名称...</div>
              <div className="h-10 rounded-lg border border-gray-200 bg-white px-3 flex items-center text-sm text-gray-400">选择输出渠道...</div>
              <div className="h-10 rounded-lg border border-gray-200 bg-white px-3 flex items-center text-sm text-gray-400">选择文案语气...</div>
              <div className="h-10 w-32 rounded-lg bg-primary-600 flex items-center justify-center text-sm text-white font-medium">生成文案</div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-5/6 rounded bg-gray-200" />
                <div className="h-3 w-4/6 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
