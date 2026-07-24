import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import TimestampConverter from "@/components/TimestampConverter";

export const metadata: Metadata = {
  title: "Unix 时间戳转换工具",
  description: "时间戳与日期相互转换，自动识别秒和毫秒，并支持多个时区。",
  alternates: {
    canonical: "/zh/tools/timestamp-converter",
    languages: {
      en: "/tools/timestamp-converter",
      "zh-CN": "/zh/tools/timestamp-converter",
    },
  },
};

export default function ChineseTimestampPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SiteHeader
          locale="zh"
          switchHref="/tools/timestamp-converter"
          badge="浏览器本地运行"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / 日期与时间
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Unix 时间戳<span className="text-slate-500">转换工具</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            在秒、毫秒和可读日期之间转换，比较时区并批量处理时间戳。
          </p>
        </header>
        <TimestampConverter />
      </div>
    </main>
  );
}
