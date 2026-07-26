import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Workbench from "@/components/Workbench";

export const metadata: Metadata = {
  title: "Developer Data Workbench — Chain JSON, Base64 & URL Tools",
  description: "Build a private browser-based workflow that chains JSON formatting, Base64 encoding, and URL transformations without uploading your data.",
  alternates: { canonical: "/workbench", languages: { en: "/workbench", "zh-CN": "/zh/workbench" } },
};

export default function WorkbenchPage() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
    <SiteHeader switchHref="/zh/workbench" badge="Local-first workflow" />
    <header className="mb-8"><p className="mb-4 text-sm font-medium text-emerald-400">Practical Tool Lab / Workbench</p><h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">Transform data once. <span className="text-slate-500">Build a reusable workflow.</span></h1><p className="mt-5 max-w-3xl text-lg leading-7 text-slate-400">Chain JSON, Base64, and URL operations in one private workspace. Your input, output, and saved workflow stay in your browser.</p></header>
    <Workbench />
    <section className="grid gap-4 py-16 md:grid-cols-3">{[
      ["Paste once", "Move through several transformations without copying data between separate pages."],
      ["Save the workflow", "Keep your operation chain on this device and use it again for the next payload."],
      ["Private by default", "The workbench performs every step locally and never sends input to our servers."],
    ].map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</section>
  </div></main>;
}
