import type { Metadata } from "next";
import JsonFormatter from "@/components/JsonFormatter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JSON 格式化与校验工具",
  description: "在浏览器中安全地格式化、压缩、排序和校验 JSON，数据不会上传。",
  alternates: {
    canonical: "/zh/tools/json-formatter",
    languages: {
      en: "/tools/json-formatter",
      "zh-CN": "/zh/tools/json-formatter",
    },
  },
};

export default function ChineseJsonFormatterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          locale="zh"
          switchHref="/tools/json-formatter"
          badge="数据仅在本地处理"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / JSON
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            JSON 格式化
            <span className="text-slate-500">与校验</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            整理难以阅读的 JSON、定位语法错误，并用树形结构查看复杂数据。
          </p>
        </header>
        <JsonFormatter />
        <section className="mx-auto max-w-3xl py-20">
          <h2 className="text-2xl font-bold">安全处理 JSON</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            所有格式化和校验都在你的浏览器中完成，输入内容不会发送到我们的服务器。
          </p>
        </section>
      </div>
    </main>
  );
}
