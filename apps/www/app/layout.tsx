import type { Metadata } from "next";
import "./globals.css";
import { MarketingHeader, Footer } from "@ai-copy/ui";

export const metadata: Metadata = {
  title: "CopyAI - AI 营销文案平台",
  description: "用 AI 快速生成高质量的营销文案",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <MarketingHeader appUrl={appUrl} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
