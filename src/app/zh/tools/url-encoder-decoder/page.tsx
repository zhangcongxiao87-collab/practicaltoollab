import type { Metadata } from "next";
import UrlEncoderDecoder from "@/components/UrlEncoderDecoder";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "URL 在线编码与解码工具",
  description: "在线编码或解码 URL 与查询参数，并查看协议、主机、路径、参数和片段，数据不会上传。",
  alternates: { canonical: "/zh/tools/url-encoder-decoder", languages: { en: "/tools/url-encoder-decoder", "zh-CN": "/zh/tools/url-encoder-decoder" } },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader locale="zh" switchHref="/tools/url-encoder-decoder" badge="数据仅在本地处理" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">开发者工具 / Web</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">URL <span className="text-slate-500">编码与解码</span></h1><p className="mt-5 max-w-2xl text-lg leading-7 text-slate-400">编码完整 URL 或单个参数，解码转义内容，并查看 URL 的每个组成部分。</p></header>
    <UrlEncoderDecoder locale="zh" />
    <section className="grid gap-4 py-20 md:grid-cols-3">{[["区分编码场景","针对完整 URL 和单个查询值使用正确的编码方式。"],["解析 URL 结构","查看协议、主机、路径、查询参数和片段。"],["保护数据隐私","全部处理都在浏览器内完成，URL 不会上传。"]].map(([a,b]) => <article key={a} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></article>)}</section>
    <RelatedTools locale="zh" tools={[{name:"Base64 编码与解码",href:"/zh/tools/base64-encoder-decoder"},{name:"JWT 在线解码",href:"/zh/tools/jwt-decoder"},{name:"JSON 格式化",href:"/zh/tools/json-formatter"}]} />
  </div></main>;
}
