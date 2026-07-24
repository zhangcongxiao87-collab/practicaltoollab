import type { Metadata } from "next";
import RegexTester from "@/components/RegexTester";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Regex Tester Online — JavaScript Regular Expressions",
  description: "Test JavaScript regular expressions online with live matches, flags, capture groups, indexes, and replacement preview.",
  alternates: { canonical: "/tools/regex-tester", languages: { en: "/tools/regex-tester", "zh-CN": "/zh/tools/regex-tester" } },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader switchHref="/zh/tools/regex-tester" badge="Live JavaScript regex" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">Developer tools / Text</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Regex <span className="text-slate-500">Tester</span></h1><p className="mt-5 max-w-2xl text-lg leading-7 text-slate-400">Build and debug JavaScript regular expressions with live matches, capture groups, flags, and replacement previews.</p></header>
    <RegexTester />
    <section className="grid gap-4 py-20 md:grid-cols-3">{[["Live feedback","See every match update as you edit the expression or test text."],["Capture details","Inspect match indexes and numbered capture groups without manual debugging."],["Replacement preview","Test replacements safely before using a regex in your code or editor."]].map(([a,b]) => <article key={a} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></article>)}</section>
    <RelatedTools locale="en" tools={[{name:"JSON Formatter",href:"/tools/json-formatter"},{name:"Base64 Encoder",href:"/tools/base64-encoder-decoder"},{name:"Nginx Log Analyzer",href:"/tools/nginx-log-analyzer"}]} />
    <footer className="border-t border-white/10 py-8 text-sm text-slate-600">© {new Date().getFullYear()} Practical Tool Lab</footer>
  </div></main>;
}
