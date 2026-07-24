import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "免费在线开发者工具",
  description: "无需注册、在浏览器本地运行的实用开发者与运维工具。",
  alternates: {
    canonical: "/zh",
    languages: { en: "/", "zh-CN": "/zh" },
  },
};

const tools = [
  {
    name: "JSON 格式化与校验",
    description: "格式化、压缩、校验并以树形结构查看 JSON。",
    href: "/zh/tools/json-formatter",
  },
  {
    name: "JSON 对比与差异查找",
    description: "按路径查找两份 JSON 中新增、删除和修改的值。",
    href: "/zh/tools/json-diff",
  },
  {
    name: "JSON 转 CSV",
    description: "展开 JSON 数据并转换成适合表格使用的 CSV。",
    href: "/zh/tools/json-to-csv",
  },
  {
    name: "JWT 在线解码",
    description: "在本地查看 JWT 头部、载荷和过期时间。",
    href: "/zh/tools/jwt-decoder",
  },
  {
    name: "Base64 编码与解码",
    description: "安全地编码 Unicode 文本或解码 Base64。",
    href: "/zh/tools/base64-encoder-decoder",
  },
  {
    name: "Nginx 日志分析",
    description: "查看状态码、热门路径、流量和错误请求。",
    href: "/zh/tools/nginx-log-analyzer",
  },
  {
    name: "Unix 时间戳转换",
    description: "转换时间戳、日期与不同时区，支持批量处理。",
    href: "/zh/tools/timestamp-converter",
  },
  {
    name: "CIDR 子网计算器",
    description: "计算网络范围、掩码、广播地址和可用 IP。",
    href: "/zh/tools/cidr-calculator",
  },
  {
    name: "Cron 表达式工具",
    description: "生成和解释 Cron 表达式，预览后续运行时间。",
    href: "/zh/tools/cron-expression-tool",
  },
];

export default function ChineseHome() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SiteHeader locale="zh" switchHref="/" />
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          简单工具。
          <span className="block text-emerald-400">解决实际问题。</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
          免费、快速、无需注册的在线工具，帮助开发者和运维人员高效完成日常任务。
        </p>
        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="mt-2 text-slate-400">{tool.description}</p>
              <p className="mt-5 text-sm font-medium text-emerald-400">
                打开工具
                <span className="ml-1 inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </section>
        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-slate-500">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
