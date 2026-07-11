import type {
  User, Plan, GenerationRecord, GenerationInput, BillingRecord,
  AdminOverview, FAQItem, Feature, GenerationChannel, GenerationTone,
  OutputType, GenerationStatus, OrderStatus, UserPlan, UserStatus,
  CopyOutput, CopyChannel,
} from "./types";

/* ====== 套餐 ====== */
export const MOCK_PLANS: Plan[] = [
  {
    code: "free",
    name: "Free",
    description: "适合初次体验，零成本开始",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "每日 3 次生成",
      "3 种输出渠道",
      "基础语气选择",
      "历史记录 7 天",
    ],
    ctaText: "免费开始",
  },
  {
    code: "pro",
    name: "Pro",
    description: "适合独立运营者和创业者",
    monthlyPrice: 79,
    yearlyPrice: 788,
    highlighted: true,
    features: [
      "每月 500 次生成",
      "全部输出渠道",
      "全部语气选择",
      "无限历史记录",
      "优先生成队列",
      "结果导出 (PDF/MD)",
    ],
    ctaText: "升级 Pro",
  },
  {
    code: "team",
    name: "Team",
    description: "适合小团队和内容工作室",
    monthlyPrice: 199,
    yearlyPrice: 1988,
    features: [
      "每月 2000 次生成",
      "全部输出渠道",
      "全部语气选择",
      "无限历史记录",
      "最高优先队列",
      "结果导出 (PDF/MD)",
      "5 个团队成员",
      "团队工作区",
    ],
    ctaText: "联系销售",
  },
];

/* ====== 功能特性 ====== */
export const MOCK_FEATURES: Feature[] = [
  {
    icon: "wand2",
    title: "AI 智能生成",
    description: "基于大语言模型，根据你的产品信息和营销场景，秒级生成高质量营销文案。",
  },
  {
    icon: "layouts",
    title: "多场景覆盖",
    description: "支持社交媒体、邮件营销、落地页、广告文案、博客文章等多种输出场景。",
  },
  {
    icon: "sliders",
    title: "灵活的语气控制",
    description: "从专业严谨到轻松幽默，5 种语气预设让你的文案更贴合品牌调性。",
  },
  {
    icon: "history",
    title: "历史管理",
    description: "自动保存所有生成记录，支持按时间、类型筛选，方便回顾和二次编辑。",
  },
  {
    icon: "download",
    title: "一键导出",
    description: "支持 Markdown 和 PDF 格式导出，无缝衔接你的内容发布流程。",
  },
  {
    icon: "users",
    title: "团队协作",
    description: "Team 套餐支持多人共享工作区，让团队文案产出保持一致性和高效率。",
  },
];

/* ====== FAQ ====== */
export const MOCK_FAQS: FAQItem[] = [
  {
    question: "免费套餐每月能生成多少条文案？",
    answer: "免费套餐每日提供 3 次生成额度，足以让你体验产品的核心功能。升级到 Pro 套餐可获得无限生成额度。",
  },
  {
    question: "生成的文案版权归谁？",
    answer: "你使用 CopyAI 生成的所有文案，版权完全归你所有。我们不会将你的生成内容用于训练模型或分享给第三方。",
  },
  {
    question: "支持哪些输出场景？",
    answer: "目前支持社交媒体文案、邮件营销、落地页文案、广告文案和博客文章五种场景。每种场景都有针对性的输出优化。",
  },
  {
    question: "可以自定义文案语气吗？",
    answer: "是的，我们提供专业、轻松、幽默、紧迫和温暖五种语气预设。Pro 及以上套餐可解锁所有语气选项。",
  },
  {
    question: "支付方式有哪些？",
    answer: "我们支持信用卡（Visa、Mastercard）和支付宝付款。年付方案享 8.3 折优惠。",
  },
  {
    question: "可以随时取消订阅吗？",
    answer: "当然可以。你可以在套餐页随时取消订阅，当前周期结束后不会继续扣费。已生成的文案和历史记录不会丢失。",
  },
];

/* ====== 输出示例 ====== */
export const MOCK_OUTPUT_EXAMPLE = `【限时抢购】618 年中大促倒计时！

🔥 全场低至 5 折，爆款商品限量抢购
📦 满 199 包邮，新人专享 30 元优惠券
⏰ 活动仅剩 48 小时，手慢无！

立即抢购 → [链接]

#618大促 #限时抢购 #超值好物`;

/* ====== 用户 ====== */
export const MOCK_USERS: User[] = [
  {
    id: "u-001",
    email: "alice@example.com",
    name: "Alice Zhang",
    role: "user",
    plan: "free",
    status: "active",
    createdAt: "2026-05-10T08:00:00Z",
    lastActiveAt: "2026-07-09T14:30:00Z",
    generationCount: 8,
  },
  {
    id: "u-002",
    email: "bob@example.com",
    name: "Bob Li",
    role: "user",
    plan: "pro",
    status: "active",
    createdAt: "2026-04-15T10:00:00Z",
    lastActiveAt: "2026-07-10T09:15:00Z",
    generationCount: 342,
  },
  {
    id: "u-003",
    email: "carol@example.com",
    name: "Carol Wang",
    role: "admin",
    plan: "team",
    status: "active",
    createdAt: "2026-03-01T08:00:00Z",
    lastActiveAt: "2026-07-10T10:00:00Z",
    generationCount: 1200,
  },
  {
    id: "u-004",
    email: "dave@example.com",
    name: "Dave Chen",
    role: "user",
    plan: "free",
    status: "banned",
    createdAt: "2026-06-20T12:00:00Z",
    lastActiveAt: "2026-06-28T16:45:00Z",
    generationCount: 3,
  },
  {
    id: "u-005",
    email: "eve@example.com",
    name: "Eve Liu",
    role: "user",
    plan: "pro",
    status: "active",
    createdAt: "2026-05-25T09:30:00Z",
    lastActiveAt: "2026-07-09T20:00:00Z",
    generationCount: 186,
  },
  {
    id: "u-006",
    email: "frank@example.com",
    name: "Frank Huang",
    role: "user",
    plan: "free",
    status: "active",
    createdAt: "2026-07-01T14:00:00Z",
    lastActiveAt: "2026-07-08T11:20:00Z",
    generationCount: 5,
  },
];

/* ====== 生成记录 ====== */
const CHANNELS: GenerationChannel[] = ["social", "email", "landing_page", "ad", "blog"];
const TONES: GenerationTone[] = ["professional", "casual", "humorous", "urgent", "warm"];
const OUTPUT_TYPES: OutputType[] = ["headline", "body", "cta", "full"];
const STATUSES: GenerationStatus[] = ["success", "success", "success", "success", "failed", "pending"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockInput(): GenerationInput {
  const products = ["SmartSneaker Pro", "GreenBrew 有机咖啡", "CloudNote 笔记应用", "FitBand 运动手环"];
  const audiences = ["18-35 岁都市白领", "健身爱好者", "自由职业者", "大学生"];
  const points = ["高品质材料", "AI 智能算法", "30 天无条件退款", "首单 8 折"];
  const product = products[Math.floor(Math.random() * products.length)];
  return {
    productName: product,
    productDescription: `${product} 是一款面向 ${audiences[Math.floor(Math.random() * audiences.length)]} 的创新产品，采用最新技术打造。`,
    targetAudience: randomItem(audiences),
    sellingPoints: randomItem(points),
    channel: randomItem(CHANNELS),
    tone: randomItem(TONES),
    outputType: randomItem(OUTPUT_TYPES),
  };
}

const MOCK_OUTPUTS = [
  "🔥 新品首发！SmartSneaker Pro 让你的每一步都智能化。内置 AI 芯片，实时分析运动数据，今日下单立减 200 元！",
  "亲爱的用户，感谢你选择 GreenBrew 有机咖啡。我们精选阿拉比卡豆，从种植到烘焙全链路有机认证，为你带来纯粹咖啡体验。",
  "还在为笔记混乱而烦恼？CloudNote 用 AI 自动归类你的想法。跨设备同步，团队协作，让创作变得前所未有的简单。",
  "【限时特惠】FitBand 运动手环首发价仅 299 元！心率监测、睡眠分析、50 米防水，你的 24 小时健康管家。",
  "告别低效！用 SmartSneaker Pro 重新定义你的运动方式。AI 教练实时指导，科学训练计划，成就更好的自己。",
];

export function generateMockRecords(count: number = 50): GenerationRecord[] {
  const records: GenerationRecord[] = [];
  const now = new Date("2026-07-10T12:00:00Z");

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(now.getTime() - i * 3600000 * (Math.random() * 48 + 1));
    records.push({
      id: `g-${String(i + 1).padStart(3, "0")}`,
      userId: randomItem(MOCK_USERS.map((u) => u.id)),
      input: generateMockInput(),
      output: randomItem(MOCK_OUTPUTS),
      status: randomItem(STATUSES),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }
  return records;
}

export const MOCK_GENERATIONS: GenerationRecord[] = generateMockRecords(50);

/* ====== 支付记录 ====== */
export const MOCK_BILLING_RECORDS: BillingRecord[] = [
  {
    id: "b-001", userId: "u-002", userEmail: "bob@example.com",
    planCode: "pro", billingCycle: "monthly", amount: 79,
    status: "paid", createdAt: "2026-07-01T08:00:00Z", paidAt: "2026-07-01T08:02:00Z",
  },
  {
    id: "b-002", userId: "u-003", userEmail: "carol@example.com",
    planCode: "team", billingCycle: "yearly", amount: 1988,
    status: "paid", createdAt: "2026-06-15T10:00:00Z", paidAt: "2026-06-15T10:01:30Z",
  },
  {
    id: "b-003", userId: "u-005", userEmail: "eve@example.com",
    planCode: "pro", billingCycle: "monthly", amount: 79,
    status: "paid", createdAt: "2026-06-20T14:00:00Z", paidAt: "2026-06-20T14:00:45Z",
  },
  {
    id: "b-004", userId: "u-002", userEmail: "bob@example.com",
    planCode: "pro", billingCycle: "monthly", amount: 79,
    status: "paid", createdAt: "2026-06-01T08:00:00Z", paidAt: "2026-06-01T08:01:00Z",
  },
  {
    id: "b-005", userId: "u-006", userEmail: "frank@example.com",
    planCode: "free", billingCycle: "monthly", amount: 0,
    status: "paid", createdAt: "2026-07-01T12:00:00Z", paidAt: "2026-07-01T12:00:00Z",
  },
  {
    id: "b-006", userId: "u-999", userEmail: "unknown@example.com",
    planCode: "pro", billingCycle: "monthly", amount: 79,
    status: "failed", createdAt: "2026-07-08T16:00:00Z",
  },
  {
    id: "b-007", userId: "u-004", userEmail: "dave@example.com",
    planCode: "pro", billingCycle: "monthly", amount: 79,
    status: "refunded", createdAt: "2026-06-10T09:00:00Z", paidAt: "2026-06-10T09:01:00Z",
  },
  {
    id: "b-008", userId: "u-005", userEmail: "eve@example.com",
    planCode: "pro", billingCycle: "monthly", amount: 79,
    status: "pending", createdAt: "2026-07-10T09:00:00Z",
  },
];

/* ====== 后台统计 ====== */
export const MOCK_ADMIN_OVERVIEW: AdminOverview = {
  totalUsers: 1284,
  newUsersToday: 23,
  totalGenerations: 87342,
  generationsToday: 456,
  totalRevenue: 128760,
  revenueThisMonth: 28450,
  successRate: 97.2,
  conversionRate: 18.5,
  activeUsersToday: 312,
};

/* ====== 套餐权益提示 ====== */
export const MOCK_USER_PLAN_INFO = {
  free: { used: 8, limit: 10, label: "本月已用 8/10 次" },
  pro: { used: 342, limit: 500, label: "本月已用 342/500 次" },
  team: { used: 1200, limit: 2000, label: "本月已用 1200/2000 次" },
};

/* ====== 结构化文案生成 Mock ====== */

export const MOCK_COPY_OUTPUTS: Record<CopyChannel, CopyOutput> = {
  website: {
    headline: "智能运动手环 Pro — 你的 24 小时健康管家",
    subtitle: "AI 精准分析每一次心跳，让运动更科学、更高效",
    cta: "限时首发价 ¥299 · 立即抢购 →",
    shortCopies: [
      "心率监测 · 睡眠分析 · 50 米防水，一款手环满足全天候健康需求。",
      "告别盲目运动！AI 教练实时指导，科学训练计划助你突破瓶颈。",
      "时尚外观 + 硬核功能，从健身房到办公室，全天佩戴无压力。",
    ],
    longCopy:
      "你是否还在凭感觉运动？智能运动手环 Pro 内置第六代 AI 心率算法，实时监测你的运动状态，自动调整训练强度。\n\n产品亮点：\n• AI 智能分析：专业级心率算法，准确率高达 97%\n• 50 米防水：游泳、淋浴无需摘取\n• 14 天超长续航：一次充电，两周无忧\n\n前 1000 名下单用户享首发折扣价 ¥299（原价 ¥499），点击上方按钮立即购买！",
  },
  moments: {
    headline: "🔥 运动达人都偷偷入手了这款手环",
    subtitle: "AI 教练 + 心率监测 + 50 米防水，居然才 ¥299",
    cta: "戳我抢购 →",
    shortCopies: [
      "每天坐着办公腰部酸痛？试试这款能提醒你站起来走走的智能手环！",
      "朋友圈都问我最近气色怎么这么好——其实是睡得好，手环帮我优化作息。",
      "健身房教练都夸我训练效率高，秘密武器就是手腕上这个小玩意儿。",
    ],
    longCopy:
      "最近入手了智能运动手环 Pro，用了一周真的后悔没早买！\n\n❤️ 最喜欢的功能：\n1. 久坐提醒——每个小时震动一下，再也不怕一坐就是半天\n2. 睡眠分析——原来我深度睡眠一直不够，调整作息后白天精神好多了\n3. 心率监测——跑步时实时看心率区间，科学调整配速\n\n而且只要 ¥299，少喝几杯奶茶就能拥有！链接放在下面了👇",
  },
  xiaohongshu: {
    headline: "小众但超实用的健康好物｜打工人必备手环",
    subtitle: "¥299 拿下 AI 智能手环，真香警告 ⚠️",
    cta: "点击链接 Get 同款 ✨",
    shortCopies: [
      "💪 健身小白也能用！AI 自动生成训练计划，不用请私教了",
      "📊 24 小时心率监测 + 压力指数，数据在手环上一目了然",
      "💤 睡眠质量差星人必入！手环帮你分析深浅睡眠比例",
    ],
    longCopy:
      "来分享一个最近发现的宝藏好物✨\n\n作为一个长期久坐的打工人，一直想入手一个手环来监测健康。对比了好几款，最后选了智能运动手环 Pro，用了两周来交作业！\n\n外观：⭐️⭐️⭐️⭐️⭐️\n简约设计，表带亲肤，戴着睡觉也无感\n\n功能：⭐️⭐️⭐️⭐️⭐️\nAI 心率监测、睡眠分析、久坐提醒、50 米防水…该有的全都有\n\n续航：⭐️⭐️⭐️⭐️\n充一次用两周，出差不用带充电器\n\n价格：⭐️⭐️⭐️⭐️⭐️\n¥299 这个价位真的无敌了\n\n姐妹们冲就完了！👇\n\n#智能手环 #健康好物 #运动装备 #打工人必备",
  },
  douyin: {
    headline: "只要 299？这款 AI 手环把千元级功能打下来了！",
    subtitle: "心率监测 + 睡眠分析 + 50 米防水，性价比天花板",
    cta: "点击左下角，马上抢购！",
    shortCopies: [
      "家人们谁懂啊！299 买到了千元级智能手环，这波真的赚到了！",
      "跑步、游泳、健身全都 hold 住，AI 教练比私教还贴心！",
      "续航 14 天不用充电，出差党狂喜！点击下方链接上车！",
    ],
    longCopy:
      "今天给大家测评一款最近超火的智能运动手环 Pro👇\n\n先说价格：只要 ¥299！你没看错！\n\n功能有多强？\n⚡ AI 智能心率算法——专业级监测，准确率 97%\n🏊 50 米防水——游泳洗澡都不用摘\n🔋 14 天超长续航——充一次用两周\n📊 睡眠分析——帮你改善睡眠质量\n\n颜值也在线！简约设计，三种颜色可选：曜石黑、陶瓷白、珊瑚粉\n\n不管是送自己还是送爸妈都超合适！\n\n💥 限时福利：前 1000 名下单再送运动臂带！\n\n左下角小黄车，手慢无！",
  },
  email: {
    headline: "智能运动手环 Pro 正式发布 — 首发特惠 ¥299",
    subtitle: "AI 驱动健康管理，让每一次运动都更有价值",
    cta: "立即购买，享首发折扣",
    shortCopies: [
      "尊敬的客户，智能运动手环 Pro 现已正式开售。前 1000 名下单享 ¥299 首发价。",
      "AI 心率监测、睡眠分析、14 天续航——一款重新定义入门手环的产品。",
      "限时优惠中，点击下方按钮立即抢购，7 天无理由退换。",
    ],
    longCopy:
      "亲爱的用户，\n\n感谢你对智能运动手环 Pro 的关注！我们很高兴地通知你，产品现已正式开售。\n\n智能运动手环 Pro 是专为追求健康生活的你打造的全天候健康伴侣：\n\n• AI 心率算法：第六代 PPG 传感器，实时精准监测\n• 智能睡眠分析：识别深睡/浅睡/REM 三个阶段\n• 50 米防水：游泳、淋浴、雨中跑步全场景适用\n• 14 天超长续航：典型场景下续航长达两周\n• 全天候佩戴：轻至 25g，亲肤表带，佩戴无感\n\n限时首发价 ¥299（原价 ¥499），前 1000 名下单额外赠送运动臂带。\n\n立即购买：[链接]\n\n智能运动手环 Pro 团队",
  },
};

export function generateMockCopyOutput(channel: CopyChannel): CopyOutput {
  return MOCK_COPY_OUTPUTS[channel];
}
