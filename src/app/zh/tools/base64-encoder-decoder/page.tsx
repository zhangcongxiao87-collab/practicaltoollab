import type { Metadata } from "next";
import Base64Tool from "@/components/Base64Tool";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Base64 在线编码与解码工具",
  description:
    "在线进行 UTF-8 文本 Base64 编码和解码，支持 URL 安全格式，数据不会上传。",
  alternates: {
    canonical: "/zh/tools/base64-encoder-decoder",
    languages: {
      en: "/tools/base64-encoder-decoder",
      "zh-CN": "/zh/tools/base64-encoder-decoder",
    },
  },
};

export default function ChineseBase64Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          locale="zh"
          switchHref="/tools/base64-encoder-decoder"
          badge="数据仅在本地处理"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / 编码
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Base64 <span className="text-slate-500">编码与解码</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            将 Unicode 文本转换为标准或 URL 安全 Base64，也可以快速还原原始文本。
          </p>
        </header>
        <Base64Tool locale="zh" />
        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["支持 Unicode", "正确处理中文、Emoji 和其他 UTF-8 国际字符。"],
            ["URL 安全格式", "替换 URL 中不安全的字符并去掉填充，适合 Token 和查询参数。"],
            ["保护数据隐私", "所有编码与解码都在浏览器内完成，内容不会上传。"],
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
