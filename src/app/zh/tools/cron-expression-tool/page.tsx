import type { Metadata } from "next";
import CronExpressionTool from "@/components/CronExpressionTool";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Cron 表达式生成与解析工具",
  description: "生成、校验并解释五段 Cron 表达式，预览不同时区的后续运行时间。",
  alternates: {
    canonical: "/zh/tools/cron-expression-tool",
    languages: {
      en: "/tools/cron-expression-tool",
      "zh-CN": "/zh/tools/cron-expression-tool",
    },
  },
};

export default function ChineseCronPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SiteHeader
          locale="zh"
          switchHref="/tools/cron-expression-tool"
          badge="五段 Cron"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / 定时任务
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Cron 表达式<span className="text-slate-500">工具</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            构建、校验并理解 Cron 计划，在用于生产环境前预览后续运行时间。
          </p>
        </header>
        <CronExpressionTool />
      </div>
    </main>
  );
}
