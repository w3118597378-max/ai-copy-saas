// ============================================================
// AI 文案生成服务 — DeepSeek V4 Flash
// 使用 OpenAI 兼容接口
// ============================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export interface AIGenerateInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  sellingPoints: string[];
  channel: string;
}

export interface AIGenerateOutput {
  headline: string;
  subtitle: string;
  cta: string;
  shortCopies: [string, string, string];
  longCopy: string;
}

// ============================================================
// 渠道中文名映射
// ============================================================
const CHANNEL_LABELS: Record<string, string> = {
  website: "官网落地页",
  moments: "微信朋友圈",
  xiaohongshu: "小红书",
  douyin: "抖音短视频",
  email: "邮件营销",
};

// ============================================================
// 调用 DeepSeek API 生成文案
// ============================================================
export async function generateCopy(input: AIGenerateInput): Promise<AIGenerateOutput> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.warn("DEEPSEEK_API_KEY 未配置，使用回退文案");
    return generateFallbackCopy(input.channel);
  }

  const channelName = CHANNEL_LABELS[input.channel] || input.channel;

  // 构造卖点列表
  const pointsStr = input.sellingPoints
    .filter((p) => p.trim())
    .map((p, i) => `${i + 1}. ${p}`)
    .join("\n");

  const prompt = `你是一个专业的营销文案写手。请根据以下产品信息，生成一套完整的营销文案。

产品名：${input.productName}
产品描述：${input.productDescription || "（未提供）"}
目标受众：${input.targetAudience || "（未指定）"}
核心卖点：
${pointsStr || "（未提供）"}
投放渠道：${channelName}

请严格按照以下 JSON 格式输出，不要有任何多余内容：
{
  "headline": "主标题",
  "subtitle": "副标题",
  "cta": "行动号召",
  "shortCopies": ["版本一", "版本二", "版本三"],
  "longCopy": "长文案"
}

要求：
- headline：简洁有力，不超过 20 字
- subtitle：补充核心价值，不超过 30 字
- cta：有紧迫感或诱惑力，不超过 15 字
- shortCopies：三版不同角度，每版不超过 30 字
- longCopy：200-400 字，分段清晰，有说服力
- 风格要符合 ${channelName} 的调性
- 所有内容用中文，不要使用 Markdown 格式`;

  // 20 秒超时保护，防止 DeepSeek API 挂起导致服务器资源耗尽
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个专业的中文营销文案写手。只输出 JSON，不要输出其他内容。" },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API 调用失败:", response.status, errorText);
      return generateFallbackCopy(input.channel);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      console.error("DeepSeek 返回内容为空");
      return generateFallbackCopy(input.channel);
    }

    const parsed = JSON.parse(rawContent);
    return {
      headline: parsed.headline || "",
      subtitle: parsed.subtitle || "",
      cta: parsed.cta || "",
      shortCopies: Array.isArray(parsed.shortCopies)
        ? (parsed.shortCopies.slice(0, 3) as [string, string, string])
        : ["", "", ""],
      longCopy: parsed.longCopy || "",
    };
  } catch (err: unknown) {
    // AbortController 超时或网络错误
    if (controller.signal.aborted) {
      console.error("DeepSeek API 请求超时（20 秒）");
    } else {
      console.error("DeepSeek API 调用异常:", err);
    }
    return generateFallbackCopy(input.channel);
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================
// 回退文案（API 不可用时使用）
// ============================================================
function generateFallbackCopy(channel: string): AIGenerateOutput {
  const templates: Record<string, AIGenerateOutput> = {
    website: {
      headline: "开启智能新体验，从这里开始",
      subtitle: "用 AI 重新定义你的工作效率",
      cta: "立即体验，限时优惠",
      shortCopies: [
        "AI 智能驱动，让工作更高效",
        "简单易用，上手即用",
        "安全可靠，值得信赖",
      ],
      longCopy:
        "在当今快节奏的商业环境中，效率就是竞争力。\n\n" +
        "我们的产品采用最新 AI 技术，帮你自动化繁琐任务，让你专注于真正重要的工作。\n\n" +
        "无论是内容创作、数据分析还是客户沟通，都能在几分钟内完成。\n\n" +
        "现在注册，享受限时优惠。",
    },
    moments: {
      headline: "试了一次就回不去了 🔥",
      subtitle: "后悔没早点发现这个效率神器",
      cta: "戳我免费试用 →",
      shortCopies: [
        "工作效率提升了 3 倍，老板都惊呆了",
        "朋友都在问我在用什么工具",
        "AI 真的比人还懂我",
      ],
      longCopy:
        "用了三天就决定推荐给所有人！\n\n" +
        "以前写一篇文案要 2 小时，现在 2 分钟就搞定了。\n\n" +
        "AI 生成的内容质量超出预期，稍微调整就能直接用。\n\n" +
        "免费版就够用了，赶紧试试吧 👇",
    },
    xiaohongshu: {
      headline: "小众但超好用｜这个 AI 工具我藏不住了",
      subtitle: "打工人必备，效率提升 10 倍",
      cta: "戳左下角获取同款 👇",
      shortCopies: [
        "💡 亮点：AI 自动生成文案，省时省力",
        "✨ 效果：内容质量高，稍微改改就能用",
        "💰 价格：免费版就很香",
      ],
      longCopy:
        "最近发现了一个宝藏 AI 工具，用了真的回不去了！\n\n" +
        "🎯 适合谁用？\n" +
        "· 需要天天写文案的运营\n" +
        "· 自己做内容的自媒体\n" +
        "· 想提高效率的打工人\n\n" +
        "✨ 最爱的功能\n" +
        "输入产品信息，AI 自动生成标题、正文、CTA\n\n" +
        "赶紧去试试吧！",
    },
    douyin: {
      headline: "这个 AI 工具太离谱了 🔥",
      subtitle: "打工人必看，效率提升 10 倍",
      cta: "点击下方链接免费领",
      shortCopies: [
        "AI 自动写文案，省下的时间摸鱼不香吗",
        "质量堪比 10 年经验的老编辑",
        "免费版就够用，赶紧冲",
      ],
      longCopy:
        "家人们！发现一个宝藏 AI 工具 🎁\n\n" +
        "✅ AI 自动生成文案\n" +
        "✅ 支持多种风格\n" +
        "✅ 免费就能用\n\n" +
        "现在不冲更待何时！",
    },
    email: {
      headline: "让你的工作效率提升 10 倍",
      subtitle: "AI 驱动的智能写作助手，新品首发优惠",
      cta: "立即免费试用",
      shortCopies: [
        "AI 智能生成：输入产品信息，秒出营销文案",
        "多场景覆盖：官网、朋友圈、小红书、抖音全支持",
        "简单高效：无需学习，上手即用",
      ],
      longCopy:
        "您好，\n\n" +
        "感谢您关注我们的产品。\n\n" +
        "这是一款 AI 驱动的营销文案生成工具，\n" +
        "只需输入产品信息，即可自动生成高质量的营销文案。\n\n" +
        "产品亮点：\n" +
        "· AI 驱动：基于大语言模型，生成自然流畅的文案\n" +
        "· 多场景：支持官网、社交媒体、邮件等多种渠道\n" +
        "· 高效便捷：2 分钟完成原本 2 小时的工作\n\n" +
        "现在注册即可免费使用。\n\n" +
        "此致\n敬礼",
    },
  };

  return templates[channel] || templates.website;
}
