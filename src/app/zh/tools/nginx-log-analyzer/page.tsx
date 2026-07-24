import type { Metadata } from "next";
import NginxLogAnalyzer from "@/components/NginxLogAnalyzer";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Nginx 访问日志在线分析工具",
  description:
    "在线分析 Nginx 访问日志，查看状态码、热门路径、独立 IP、流量与错误请求，日志不会上传。",
  alternates: {
    canonical: "/zh/tools/nginx-log-analyzer",
    languages: {
      en: "/tools/nginx-log-analyzer",
      "zh-CN": "/zh/tools/nginx-log-analyzer",
    },
  },
};

export default function ChineseNginxLogAnalyzerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          locale="zh"
          switchHref="/tools/nginx-log-analyzer"
          badge="日志不会离开浏览器"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            运维工具 / Web 服务器
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Nginx 日志<span className="text-slate-500">分析工具</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            将原始访问日志转换为清晰的流量概览，查看状态码、热门路径、客户端 IP 和错误请求。
          </p>
        </header>
        <NginxLogAnalyzer locale="zh" />
        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["快速查看概况", "集中查看请求量、独立客户端、响应流量、错误数和成功率。"],
            ["定位运维问题", "筛选 4xx 与 5xx 请求，搜索路径或 IP，发现频繁失败的接口。"],
            ["敏感日志留在本地", "解析和统计全部在浏览器内运行，访问日志不会上传。"],
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
