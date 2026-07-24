import type { Metadata } from "next";
import JwtDecoder from "@/components/JwtDecoder";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JWT 在线解码工具",
  description:
    "在浏览器本地解码 JWT Header 和 Payload，查看过期、签发和生效时间，Token 不会上传。",
  alternates: {
    canonical: "/zh/tools/jwt-decoder",
    languages: {
      en: "/tools/jwt-decoder",
      "zh-CN": "/zh/tools/jwt-decoder",
    },
  },
};

export default function ChineseJwtDecoderPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          locale="zh"
          switchHref="/tools/jwt-decoder"
          badge="仅在本地解码"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / 安全
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            JWT <span className="text-slate-500">在线解码</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            查看 JSON Web Token 的 Header、Payload、时间声明和签名部分，Token 不会离开浏览器。
          </p>
        </header>
        <JwtDecoder locale="zh" />
        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["清晰查看声明", "美化 Header 与 Payload JSON，并把 Unix 时间转换成可读日期。"],
            ["快速判断过期", "立即查看 Token 已过期、尚未过期，还是没有 exp 声明。"],
            ["避免安全误判", "明确区分解码与签名验证，不会把可读取的数据错误标记为可信。"],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
