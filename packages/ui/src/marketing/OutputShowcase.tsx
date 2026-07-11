import React from "react";
import { Card } from "../Card";

export function OutputShowcase({ content }: { content: string }) {
  return (
    <section className="border-t border-gray-100 bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">看看 AI 生成的文案</h2>
          <p className="mt-4 text-lg text-gray-600">输入简单的产品描述，即可获得专业级营销文案</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Card className="overflow-hidden">
            <div className="rounded-t-xl border-b border-gray-100 bg-gray-50 px-4 py-2 flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">社交媒体</span>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">限时促销</span>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-700 font-sans">{content}</pre>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
