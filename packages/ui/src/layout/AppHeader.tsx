import React from "react";
import { Bell } from "lucide-react";

export function AppHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}
