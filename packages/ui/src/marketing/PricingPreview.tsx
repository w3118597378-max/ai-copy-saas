"use client";
import React, { useState } from "react";
import { PricingCard } from "./PricingCard";
import { cn } from "../cn";
import type { Plan } from "@ai-copy/shared";

export function PricingPreview({ plans }: { plans: Plan[] }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const handleSelect = (plan: Plan) => { alert(`[Mock] 选择了 ${plan.name}，年付: ${isAnnual}`); };
  return (
    <section id="pricing" className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">透明定价，按需选择</h2>
          <p className="mt-4 text-lg text-gray-600">从免费到团队，找到适合你的方案</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-sm", !isAnnual ? "font-semibold text-gray-900" : "text-gray-500")}>月付</span>
          <button onClick={() => setIsAnnual(!isAnnual)}
            className={cn("relative h-6 w-11 rounded-full transition-colors", isAnnual ? "bg-primary-600" : "bg-gray-200")}>
            <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", isAnnual && "translate-x-5")} />
          </button>
          <span className={cn("text-sm", isAnnual ? "font-semibold text-gray-900" : "text-gray-500")}>年付</span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">省 17%</span>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-start">
          {plans.map((plan) => <PricingCard key={plan.code} plan={plan} isAnnual={isAnnual} onSelect={handleSelect} />)}
        </div>
      </div>
    </section>
  );
}
