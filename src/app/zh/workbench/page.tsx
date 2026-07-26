import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Workbench from "@/components/Workbench";

export const metadata: Metadata = {
  title: "开发者数据工作台 — 串联 JSON、Base64 与 URL 工具",
  description: "在浏览器本地串联 JSON 格式化、Base64 编解码和 URL 转换，数据无需上传。",
  alternates: { canonical: "/zh/workbench", languages: { en: "/workbench", "zh-CN": "/zh/workbench" } },
};

export default function ChineseWorkbenchPage() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader locale="zh" switchHref="/workbench" badge="本地优先工作流" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">Practical Tool Lab / 工作台</p><h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">数据只粘贴一次。<span className="text-slate-500">构建可重复使用的流程。</span></h1><p className="mt-5 max-w-3xl text-lg leading-7 text-slate-400">在一个私密工作区中串联 JSON、Base64 和 URL 操作。输入、输出和保存的流程都留在浏览器本地。</p></header>
    <Workbench locale="zh" />
    <section className="grid gap-4 py-16 md:grid-cols-3">{[
      ["只需粘贴一次", "连续完成多个转换，无需在不同工具页面之间反复复制数据。"],
      ["保存处理流程", "把操作链保存在当前设备，下次处理新的数据时直接复用。"],
      ["默认保护隐私", "所有步骤都在浏览器本地运行，输入内容不会发送到服务器。"],
    ].map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</section>
  </div></main>;
}
