"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../cn";
import { LayoutDashboard, Users, FileText, Receipt, Shield } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "总览", icon: LayoutDashboard },
  { href: "/users", label: "用户管理", icon: Users },
  { href: "/generations", label: "生成记录", icon: FileText },
  { href: "/billing", label: "支付订阅", icon: Receipt },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-900 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white text-sm font-bold">C</div>
        <div><span className="text-lg font-bold">CopyAI</span><span className="ml-2 text-xs text-gray-400">Admin</span></div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary-600/20 text-primary-300" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}>
              <Icon className="h-5 w-5" /> <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">超级管理员</span>
        </div>
      </div>
    </aside>
  );
}
