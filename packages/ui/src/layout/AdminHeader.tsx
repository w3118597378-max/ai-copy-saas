import React from "react";

export function AdminHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500">2026-07-10</div>
    </header>
  );
}
