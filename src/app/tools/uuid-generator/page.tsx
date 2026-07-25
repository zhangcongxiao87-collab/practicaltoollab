import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";
import UuidGenerator from "@/components/UuidGenerator";

export const metadata: Metadata = {
  title: "UUID Generator Online — Bulk UUID v4 Generator",
  description: "Generate one or up to 100 secure random UUID v4 values online. Copy or download UUIDs with optional uppercase letters and hyphens.",
  alternates: { canonical: "/tools/uuid-generator", languages: { en: "/tools/uuid-generator", "zh-CN": "/zh/tools/uuid-generator" } },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader switchHref="/zh/tools/uuid-generator" badge="Secure local generation" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">Developer tools / Identifiers</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">UUID Generator <span className="text-slate-500">v4</span></h1><p className="mt-5 max-w-2xl text-lg leading-7 text-slate-400">Generate secure random UUID v4 identifiers individually or in bulk, then copy or download them instantly.</p></header>
    <UuidGenerator />
    <section className="grid gap-4 py-16 md:grid-cols-3">{[
      ["Cryptographically random", "Uses your browser's secure random generator and produces RFC 4122 UUID version 4 values."],
      ["Bulk generation", "Create up to 100 identifiers at once with optional uppercase output and removed hyphens."],
      ["Private by design", "UUIDs are generated locally. Nothing is uploaded or stored on our servers."],
    ].map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</section>
    <section className="mb-16 max-w-3xl"><h2 className="text-2xl font-bold">What is a UUID v4?</h2><p className="mt-4 leading-7 text-slate-400">A UUID is a 128-bit identifier commonly used for database records, API objects, distributed systems, test data, and request tracing. Version 4 UUIDs are generated from random data, so they can be created independently without a central service.</p><h2 className="mt-10 text-2xl font-bold">Frequently asked questions</h2><div className="mt-5 space-y-4"><article className="rounded-xl border border-white/10 p-5"><h3 className="font-semibold">Are these UUIDs unique?</h3><p className="mt-2 text-sm leading-6 text-slate-400">No finite random identifier offers an absolute guarantee, but the probability of a collision between properly generated UUID v4 values is extraordinarily small.</p></article><article className="rounded-xl border border-white/10 p-5"><h3 className="font-semibold">Are my generated UUIDs saved?</h3><p className="mt-2 text-sm leading-6 text-slate-400">No. Generation happens entirely inside your browser and the values disappear when you leave or refresh the page.</p></article></div></section>
    <RelatedTools locale="en" tools={[{name:"JSON Formatter",href:"/tools/json-formatter"},{name:"JWT Decoder",href:"/tools/jwt-decoder"},{name:"Timestamp Converter",href:"/tools/timestamp-converter"}]} />
    <footer className="border-t border-white/10 py-8 text-sm text-slate-600">© {new Date().getFullYear()} Practical Tool Lab</footer>
  </div></main>;
}
