"use client";
import React, { useState } from "react";
import { cn } from "@ai-copy/ui";
import { ChevronDown } from "lucide-react";
import { MOCK_FAQS } from "@ai-copy/shared";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">常见问题</h1>
          <p className="mt-4 text-lg text-gray-600">关于 CopyAI 你可能想了解的一切</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-gray-200">
          {MOCK_FAQS.map((item, index) => (
            <div key={index} className="py-5">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between text-left">
                <span className="text-base font-medium text-gray-900">{item.question}</span>
                <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform", openIndex === index && "rotate-180")} />
              </button>
              {openIndex === index && <p className="mt-3 pr-8 text-sm leading-7 text-gray-500">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
