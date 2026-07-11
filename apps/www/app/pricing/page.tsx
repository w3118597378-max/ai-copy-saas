"use client";
import React, { useState } from "react";
import { PricingCard, cn } from "@ai-copy/ui";
import { MOCK_PLANS } from "@ai-copy/shared";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const handleSelect = (plan: any) => { alert("[Mock] 选择了 " + plan.name + " 套餐"); };
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">定价方案</h1>
          <p className="mt-4 text-lg text-gray-600">选择最适合你的方案，随时升级或取消</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-sm", !isAnnual ? "font-semibold text-gray-900" : "text-gray-500")}>月付</span>
          <button onClick={() => setIsAnnual(!isAnnual)}
            className={cn("relative h-6 w-11 rounded-full transition-colors", isAnnual ? "bg-primary-600" : "bg-gray-200")}>
            <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", isAnnual && "translate-x-5")} />
          </button>
          <span className={cn("text-sm", isAnnual ? "font-semibold text-gray-900" : "text-gray-500")}>年付 <span className="text-green-600 font-normal">省 17%</span></span>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-start">
          {MOCK_PLANS.map((plan) => <PricingCard key={plan.code} plan={plan} isAnnual={isAnnual} onSelect={handleSelect} />)}
        </div>
      </div>
    </div>
  );
}
