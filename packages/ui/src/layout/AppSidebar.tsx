"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../cn";
import { Badge } from "../Badge";
import { useAuth } from "../auth/AuthProvider";
import { Wand2, History, CreditCard, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/generate", label: "生成工作台", icon: Wand2 },
  { href: "/history", label: "历史记录", icon: History },
  { href: "/billing", label: "套餐管理", icon: CreditCard },
];

export function AppSidebar({ userName = "用户", userPlan = "free", usageLabel }: { userName?: string; userPlan?: string; usageLabel?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">C</div>
        <span className="text-lg font-bold text-gray-900">CopyAI</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}>
              <Icon className="h-5 w-5" /> <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-4">
        {usageLabel && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>本月用量</span><span>{usageLabel}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-primary-500" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <Badge variant={userPlan === "free" ? "default" : "info"}>
              {userPlan === "free" ? "免费版" : userPlan === "pro" ? "Pro" : "Team"}
            </Badge>
          </div>
        </div>
        <button onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
