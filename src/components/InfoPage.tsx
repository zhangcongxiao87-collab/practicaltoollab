import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

const content = {
  en: {
    about: ["About Practical Tool Lab", "Small tools for real work.", ["Practical Tool Lab is an independent collection of fast, focused tools for developers, analysts, and operations teams.", "Most tools run entirely in your browser. We prefer clear interfaces, useful defaults, and honest privacy boundaries over unnecessary complexity."]],
    contact: ["Contact", "Questions, problems, or ideas?", ["For bug reports and feature suggestions, open an issue in our public GitHub repository. Please never include passwords, API keys, tokens, private logs, or other sensitive data.", "We review practical suggestions that improve existing tools or solve recurring developer and operations problems."]],
    privacy: ["Privacy Policy", "Your data should stay yours.", ["The interactive tools on this site are designed to process input locally in your browser unless a page explicitly states otherwise. We do not intentionally receive the JSON, tokens, logs, URLs, or text you paste into these tools.", "We use Vercel Web Analytics to understand anonymous page traffic. It does not use third-party cookies. Hosting and security providers may process standard request information such as IP address, browser, requested URL, and timestamps to operate and protect the service.", "Do not submit secrets to any online service unless you understand its security model. This policy may be updated as the site adds accounts, payments, or server-side features." ]],
  },
  zh: {
    about: ["关于 Practical Tool Lab", "用小工具解决真实工作问题。", ["Practical Tool Lab 是一个独立开发的在线工具集合，面向开发者、数据分析和运维人员。", "大多数工具完全在浏览器本地运行。我们重视清晰界面、实用默认值和诚实的隐私边界，而不是不必要的复杂功能。"]],
    contact: ["联系我们", "发现问题，或者有新的想法？", ["如需报告错误或建议功能，请在我们的公开 GitHub 仓库中创建 Issue。请勿提交密码、API Key、Token、私密日志或其他敏感数据。", "我们会优先考虑能够改善现有工具，或解决开发与运维高频问题的建议。"]],
    privacy: ["隐私政策", "你的数据应该属于你。", ["本站交互工具默认在浏览器本地处理输入，除非页面明确说明使用服务器。我们不会主动接收你粘贴的 JSON、Token、日志、URL 或文本。", "本站使用 Vercel Web Analytics 了解匿名页面访问情况，它不使用第三方 Cookie。托管与安全服务商可能处理 IP 地址、浏览器、访问网址和时间等标准请求信息，以运行和保护网站。", "除非充分了解安全模式，否则不要向任何在线服务提交秘密信息。未来增加账户、支付或服务端功能时，本政策可能更新。"]],
  },
} as const;

export default function InfoPage({ locale, type }: { locale: "en" | "zh"; type: "about" | "contact" | "privacy" }) {
  const [title, subtitle, paragraphs] = content[locale][type];
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-4xl px-6 py-10 sm:py-16">
    <SiteHeader locale={locale} switchHref={`${locale === "zh" ? "" : "/zh"}/${type}`} />
    <p className="text-sm font-medium text-emerald-400">Practical Tool Lab</p>
    <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
    <p className="mt-5 text-xl text-slate-400">{subtitle}</p>
    <div className="mt-12 space-y-6 border-t border-white/10 pt-10 text-base leading-8 text-slate-300">
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {type === "contact" && <Link href="https://github.com/zhangcongxiao87-collab/practicaltoollab/issues" className="inline-flex rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950">GitHub Issues →</Link>}
    </div>
  </div></main>;
}
