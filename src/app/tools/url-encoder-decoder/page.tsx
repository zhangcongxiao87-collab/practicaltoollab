import type { Metadata } from "next";
import UrlEncoderDecoder from "@/components/UrlEncoderDecoder";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder Online — Practical Tool Lab",
  description: "Encode or decode URLs and query parameters online. Inspect protocol, host, path, parameters, and fragments locally in your browser.",
  alternates: { canonical: "/tools/url-encoder-decoder", languages: { en: "/tools/url-encoder-decoder", "zh-CN": "/zh/tools/url-encoder-decoder" } },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader switchHref="/zh/tools/url-encoder-decoder" badge="100% local processing" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">Developer tools / Web</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">URL <span className="text-slate-500">Encoder &amp; Decoder</span></h1><p className="mt-5 max-w-2xl text-lg leading-7 text-slate-400">Encode complete URLs or individual components, decode escaped values, and inspect every part of a URL.</p></header>
    <UrlEncoderDecoder />
    <section className="grid gap-4 py-20 md:grid-cols-3">{[["Component-aware","Choose the correct encoding behavior for complete URLs or individual query values."],["URL breakdown","Inspect protocol, host, path, query parameters, and fragment after decoding."],["Private by design","Everything runs in your browser; URLs are never sent to a server."]].map(([a,b]) => <article key={a} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></article>)}</section>
    <RelatedTools locale="en" tools={[{name:"Base64 Encoder & Decoder",href:"/tools/base64-encoder-decoder"},{name:"JWT Decoder",href:"/tools/jwt-decoder"},{name:"JSON Formatter",href:"/tools/json-formatter"}]} />
    <footer className="border-t border-white/10 py-8 text-sm text-slate-600">© {new Date().getFullYear()} Practical Tool Lab</footer>
  </div></main>;
}
