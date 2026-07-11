import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">C</div>
              <span className="text-lg font-bold text-gray-900">CopyAI</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">AI 驱动的营销文案平台，让你的内容创作效率提升 10 倍。</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">产品</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">定价</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900">常见问题</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">法律</h4>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-gray-500">隐私政策</span></li>
              <li><span className="text-sm text-gray-500">服务条款</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">联系我们</h4>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-gray-500">hello@copyai.com</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">&copy; 2026 CopyAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
