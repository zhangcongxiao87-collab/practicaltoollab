import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";
import UuidGenerator from "@/components/UuidGenerator";

export const metadata: Metadata = {
  title: "UUID 在线生成器 — 批量生成 UUID v4",
  description: "在线安全生成 1 至 100 个随机 UUID v4，支持批量复制、下载、大小写转换和移除连字符。",
  alternates: { canonical: "/zh/tools/uuid-generator", languages: { en: "/tools/uuid-generator", "zh-CN": "/zh/tools/uuid-generator" } },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader locale="zh" switchHref="/tools/uuid-generator" badge="安全本地生成" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">开发者工具 / 标识符</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">UUID 在线生成器 <span className="text-slate-500">v4</span></h1><p className="mt-5 max-w-2xl text-lg leading-7 text-slate-400">安全生成单个或批量 UUID v4 标识符，一键复制或下载结果。</p></header>
    <UuidGenerator locale="zh" />
    <section className="grid gap-4 py-16 md:grid-cols-3">{[
      ["安全随机生成", "使用浏览器安全随机数生成器，生成符合 RFC 4122 的 UUID v4。"],
      ["支持批量处理", "一次生成最多 100 个 UUID，并可选择大写输出或移除连字符。"],
      ["隐私优先", "所有 UUID 都在浏览器本地生成，不会上传或保存在服务器上。"],
    ].map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</section>
    <section className="mb-16 max-w-3xl"><h2 className="text-2xl font-bold">什么是 UUID v4？</h2><p className="mt-4 leading-7 text-slate-400">UUID 是一种 128 位标识符，常用于数据库主键、API 对象、分布式系统、测试数据和请求追踪。UUID v4 基于随机数据生成，因此无需中心服务器也能独立创建。</p><h2 className="mt-10 text-2xl font-bold">常见问题</h2><div className="mt-5 space-y-4"><article className="rounded-xl border border-white/10 p-5"><h3 className="font-semibold">生成的 UUID 会重复吗？</h3><p className="mt-2 text-sm leading-6 text-slate-400">随机标识符无法提供数学上的绝对保证，但规范生成的 UUID v4 出现碰撞的概率极低，足以满足绝大多数应用。</p></article><article className="rounded-xl border border-white/10 p-5"><h3 className="font-semibold">网站会保存生成结果吗？</h3><p className="mt-2 text-sm leading-6 text-slate-400">不会。生成过程完全在浏览器本地完成，刷新或离开页面后结果即会消失。</p></article></div></section>
    <RelatedTools locale="zh" tools={[{name:"JSON 格式化",href:"/zh/tools/json-formatter"},{name:"JWT 在线解码",href:"/zh/tools/jwt-decoder"},{name:"Unix 时间戳转换",href:"/zh/tools/timestamp-converter"}]} />
    <footer className="border-t border-white/10 py-8 text-sm text-slate-600">© {new Date().getFullYear()} Practical Tool Lab</footer>
  </div></main>;
}
