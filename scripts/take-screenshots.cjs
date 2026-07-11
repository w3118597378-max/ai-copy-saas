const { chromium } = require("C:\\Users\\王顺成\\AppData\\Roaming\\npm\\node_modules\\playwright");
const path = require("path");

const OUTPUT = path.resolve(__dirname, "../screenshots");
const VIEWPORT = { width: 1440, height: 900 };

const PAGES = [
  { url: "https://ai-copy-www.vercel.app",        file: "01-homepage.png",   label: "营销官网首页" },
  { url: "https://ai-copy-www.vercel.app/pricing", file: "02-pricing.png",   label: "定价方案" },
  { url: "https://ai-copy-www.vercel.app/faq",     file: "03-faq.png",       label: "FAQ" },
  { url: "https://ai-copy-app.vercel.app/login",   file: "04-login.png",     label: "登录页面" },
  { url: "https://ai-copy-app.vercel.app/register", file: "05-register.png",  label: "注册页面" },
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });

  for (const { url, file, label } of PAGES) {
    const page = await context.newPage();
    const filePath = path.join(OUTPUT, file);
    console.log(`📸 正在截图: ${label} (${url})`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`  ✅ 已保存: screenshots/${file}`);
    } catch (err) {
      console.log(`  ❌ 失败: ${err.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("\n🎉 截图完成!");
}

takeScreenshots().catch(console.error);
