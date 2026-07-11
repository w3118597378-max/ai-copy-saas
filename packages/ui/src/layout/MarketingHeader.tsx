"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../Button";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/pricing", label: "定价" },
  { href: "/faq", label: "常见问题" },
];

export function MarketingHeader({ appUrl = "http://localhost:3001" }: { appUrl?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loginUrl = `${appUrl}/login`;
  const registerUrl = `${appUrl}/register`;
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">C</div>
          <span className="text-lg font-bold text-gray-900">CopyAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">{item.label}</Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href={loginUrl}><Button variant="ghost" size="sm">登录</Button></Link>
          <Link href={registerUrl}><Button size="sm">免费注册</Button></Link>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-600 hover:text-gray-900">{item.label}</Link>
          ))}
          <div className="pt-2 flex gap-3">
            <Link href={loginUrl} className="flex-1"><Button variant="outline" size="sm" className="w-full">登录</Button></Link>
            <Link href={registerUrl} className="flex-1"><Button size="sm" className="w-full">免费注册</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
