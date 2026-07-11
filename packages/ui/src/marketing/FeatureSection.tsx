import React from "react";
import type { Feature } from "@ai-copy/shared";
import * as Icons from "lucide-react";

export function FeatureSection({ features }: { features: Feature[] }) {
  return (
    <section id="features" className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">强大的文案生成能力</h2>
          <p className="mt-4 text-lg text-gray-600">从社交媒体到博客文章，Cover 你的所有营销场景</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = (Icons as any)[feature.icon.charAt(0).toUpperCase() + feature.icon.slice(1)] || Icons.Wand2;
            return (
              <div key={index} className="group rounded-xl border border-gray-100 p-6 transition-all hover:border-primary-100 hover:shadow-md hover:shadow-primary-100/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
