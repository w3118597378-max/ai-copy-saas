import React from "react";
import { cn } from "../cn";
import { Button } from "../Button";
import { Check } from "lucide-react";
import type { Plan } from "@ai-copy/shared";

export function PricingCard({ plan, isAnnual, onSelect }: { plan: Plan; isAnnual: boolean; onSelect: (plan: Plan) => void }) {
  const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
  return (
    <div className={cn("relative flex flex-col rounded-2xl border p-8 transition-all",
      plan.highlighted ? "border-primary-200 bg-primary-50/30 shadow-lg shadow-primary-100/30 scale-105" : "border-gray-200 bg-white hover:border-primary-100 hover:shadow-md"
    )}>
      {plan.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-medium text-white">最受欢迎</div>}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
        <div className="mt-6">
          <span className="text-4xl font-bold text-gray-900">{price === 0 ? "免费" : `¥${price}`}</span>
          {price > 0 && <span className="ml-1 text-sm text-gray-500">/{isAnnual ? "年" : "月"}</span>}
        </div>
        {isAnnual && plan.yearlyPrice > 0 && <p className="mt-1 text-xs text-green-600">年付享 8.3 折优惠</p>}
      </div>
      <ul className="mt-8 space-y-3 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Button variant={plan.highlighted ? "primary" : "outline"} className="mt-8 w-full" onClick={() => onSelect(plan)}>
        {plan.ctaText}
      </Button>
    </div>
  );
}
