import type { Metadata } from "next";
import JsonDiff from "@/components/JsonDiff";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JSON 对比工具：在线查找数据差异",
  description:
    "在线对比两份 JSON，按路径查找新增、删除和修改的值。完全在浏览器本地运行，数据不会上传。",
  alternates: {
    canonical: "/zh/tools/json-diff",
    languages: {
      en: "/tools/json-diff",
      "zh-CN": "/zh/tools/json-diff",
    },
  },
};

export default function ChineseJsonDiffPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          locale="zh"
          switchHref="/tools/json-diff"
          badge="数据仅在本地处理"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            开发者工具 / JSON
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            JSON 对比<span className="text-slate-500">与差异查找</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            对比两份 JSON 的实际数据结构，准确找出新增、删除和修改的内容，不受空格和对象键顺序影响。
          </p>
        </header>

        <JsonDiff locale="zh" />

        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["结构化对比", "解析数据后再进行对比，空格、缩进和对象键顺序不会制造虚假差异。"],
            ["精确定位路径", "每一项差异都包含完整 JSON 路径，方便排查大型接口数据。"],
            ["保护敏感数据", "输入、对比、筛选和报告导出均在你的浏览器本地完成。"],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
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
