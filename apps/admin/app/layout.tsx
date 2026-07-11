import type { Metadata } from "next";
import "./globals.css";
import { AdminAuthLayout } from "./AdminAuthLayout";

export const metadata: Metadata = {
  title: "CopyAI — 管理后台",
  description: "CopyAI 运营管理后台",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body><AdminAuthLayout>{children}</AdminAuthLayout></body>
    </html>
  );
}
