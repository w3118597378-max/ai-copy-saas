import React from "react";
import { ExternalLink, Wand2 } from "lucide-react";

export function AdminHeader({ title, description }: { title: string; description?: string }) {
  const wwwUrl = process.env.NEXT_PUBLIC_WWW_URL || "http://localhost:3000";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <a href={`${appUrl}/generate`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors">
          <Wand2 className="h-4 w-4" /> <span>用户工作台</span>
        </a>
        <a href={wwwUrl}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <ExternalLink className="h-4 w-4" /> <span>官网</span>
        </a>
      </div>
    </header>
  );
}
