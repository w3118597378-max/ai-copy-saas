import React from "react";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowRight } from "lucide-react";

export function CTASection({ appUrl = "http://localhost:3001" }: { appUrl?: string }) {
  return (
    <section className="bg-primary-600 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">准备好提升你的文案效率了吗？</h2>
          <p className="mt-4 text-lg text-primary-100">注册即享每日 3 次免费生成，无需信用卡</p>
          <div className="mt-10">
            <Link href={`${appUrl}/register`}>
              <Button size="lg" className="border-2 border-white bg-white text-primary-600 hover:bg-primary-50 gap-2">
                免费开始使用 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
