import type { Metadata } from "next";
import RegexTester from "@/components/RegexTester";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "正则表达式在线测试工具",
  description: "在线测试 JavaScript 正则表达式，实时查看匹配、标志、捕获组、位置和替换预览。",
  alternates: { canonical: "/zh/tools/regex-tester", languages: { en: "/tools/regex-tester", "zh-CN": "/zh/tools/regex-tester" } },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader locale="zh" switchHref="/tools/regex-tester" badge="实时 JavaScript 正则" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">开发者工具 / 文本</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">正则表达式<span className="text-slate-500">测试工具</span></h1><p className="mt-5 max-w-2xl text-lg leading-7 text-slate-400">实时测试 JavaScript 正则表达式，查看匹配、捕获组、标志和替换效果。</p></header>
    <RegexTester locale="zh" />
    <section className="grid gap-4 py-20 md:grid-cols-3">{[["实时反馈","编辑表达式或测试文本时立即更新所有匹配。"],["捕获组明细","直接查看匹配位置和编号捕获组。"],["替换预览","在代码或编辑器中使用前，安全检查替换结果。"]].map(([a,b]) => <article key={a} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></article>)}</section>
    <RelatedTools locale="zh" tools={[{name:"JSON 格式化",href:"/zh/tools/json-formatter"},{name:"Base64 编码",href:"/zh/tools/base64-encoder-decoder"},{name:"Nginx 日志分析",href:"/zh/tools/nginx-log-analyzer"}]} />
  </div></main>;
}
