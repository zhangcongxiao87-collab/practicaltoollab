import type { Metadata } from "next";
import NginxLogAnalyzer from "@/components/NginxLogAnalyzer";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Nginx Log Analyzer Online — Practical Tool Lab",
  description:
    "Analyze Nginx access logs online. Inspect status codes, top paths, unique IPs, traffic, and error requests locally in your browser.",
  alternates: {
    canonical: "/tools/nginx-log-analyzer",
    languages: {
      en: "/tools/nginx-log-analyzer",
      "zh-CN": "/zh/tools/nginx-log-analyzer",
    },
  },
};

export default function NginxLogAnalyzerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          switchHref="/zh/tools/nginx-log-analyzer"
          badge="Logs never leave your browser"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Operations tools / Web servers
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Nginx Log <span className="text-slate-500">Analyzer</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Turn raw access logs into a fast traffic overview with status
            distribution, top paths, client IPs, and error filtering.
          </p>
        </header>
        <NginxLogAnalyzer />
        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["Immediate overview", "See request volume, unique clients, response bytes, error counts, and success rate at a glance."],
            ["Find operational issues", "Filter 4xx and 5xx requests, search paths or IPs, and spot frequently failing endpoints."],
            ["Sensitive logs stay local", "Parsing and analysis run entirely in your browser; access logs are never uploaded."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold">Supported Nginx log formats</h2>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            This analyzer supports standard Nginx combined and common access log
            lines. Custom log formats may be skipped when their field order does
            not match these formats.
          </p>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
