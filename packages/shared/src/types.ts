/* ====== 用户 ====== */
export type UserRole = "user" | "admin";
export type UserPlan = "free" | "pro" | "team";
export type BillingStatus = "pending" | "paid" | "failed" | "refunded" | "canceled";
export type UserStatus = "active" | "banned";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;       // ISO 8601
  lastActiveAt: string;
  generationCount: number;
}

/* ====== 套餐 ====== */
export type BillingCycle = "monthly" | "yearly";

export interface Plan {
  code: UserPlan;
  name: string;
  description: string;
  monthlyPrice: number;    // 单位 元
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

/* ====== 文案生成 ====== */
export type GenerationChannel = "social" | "email" | "landing_page" | "ad" | "blog";
export type GenerationTone = "professional" | "casual" | "humorous" | "urgent" | "warm";
export type GenerationStatus = "pending" | "generating" | "success" | "failed";
export type OutputType = "headline" | "body" | "cta" | "full";

/* ====== 结构化文案输出 ====== */
export type CopyChannel = "website" | "moments" | "xiaohongshu" | "douyin" | "email";

export const COPY_CHANNELS: { value: CopyChannel; label: string }[] = [
  { value: "website", label: "官网" },
  { value: "moments", label: "朋友圈" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "douyin", label: "抖音" },
  { value: "email", label: "邮件" },
];

export interface CopyFormData {
  productName: string;
  productDescription: string;
  targetAudience: string;
  sellingPoints: [string, string, string];
  channel: CopyChannel;
}

export interface CopyOutput {
  headline: string;
  subtitle: string;
  cta: string;
  shortCopies: [string, string, string];
  longCopy: string;
}

export interface GenerationInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  sellingPoints: string;
  channel: GenerationChannel;
  tone: GenerationTone;
  outputType: OutputType;
}

export interface GenerationRecord {
  id: string;
  userId: string;
  input: GenerationInput;
  output: string;
  status: GenerationStatus;
  createdAt: string;
  updatedAt: string;
}

/* ====== 支付订单 ====== */
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface BillingRecord {
  id: string;
  userId: string;
  userEmail: string;
  planCode: UserPlan;
  billingCycle: BillingCycle;
  amount: number;           // 单位 元
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
}

/* ====== 后台统计 ====== */
export interface AdminOverview {
  totalUsers: number;
  newUsersToday: number;
  totalGenerations: number;
  generationsToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  successRate: number;
  conversionRate: number;
  activeUsersToday: number;
}

/* ====== FAQ ====== */
export interface FAQItem {
  question: string;
  answer: string;
}

/* ====== 功能特性 ====== */
export interface Feature {
  icon: string;   // lucide icon name
  title: string;
  description: string;
}
