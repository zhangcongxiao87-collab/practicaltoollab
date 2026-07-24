import type { Metadata } from "next";
import JsonToCsv from "@/components/JsonToCsv";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JSON 转 CSV 在线转换工具",
  description:
    "在线将 JSON 对象数组转换为 CSV，支持展开嵌套字段、表格预览和下载，数据不会上传。",
  alternates: {
    canonical: "/zh/tools/json-to-csv",
    languages: {
      en: "/tools/json-to-csv",
      "zh-CN": "/zh/tools/json-to-csv",
    },
  },
};

export default function ChineseJsonToCsvPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          locale="zh"
          switchHref="/tools/json-to-csv"
          badge="数据仅在本地处理"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / 数据转换
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            JSON 转 CSV <span className="text-slate-500">转换工具</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            将 JSON 对象转换成适合 Excel 和 Google Sheets 使用的 CSV，并自动展开嵌套字段。
          </p>
        </header>
        <JsonToCsv locale="zh" />
        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["处理嵌套数据", "把嵌套对象展开成点分隔列，数组则保留为可读 JSON。"],
            ["兼容中文表格", "正确处理引号、换行与分隔符，下载文件包含 UTF-8 标记。"],
            ["数据保持私密", "转换全部在浏览器中完成，敏感数据不会上传到服务器。"],
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
