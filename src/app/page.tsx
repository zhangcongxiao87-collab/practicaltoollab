import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/zh" },
  },
};

export default function Home() {
  const tools = [
    {
      name: "JSON Formatter",
      description: "Format, validate, and read JSON more easily.",
      href: "/tools/json-formatter",
      status: "Open tool",
    },
    {
      name: "JSON Diff & Compare",
      description: "Find added, removed, and changed JSON values by path.",
      href: "/tools/json-diff",
      status: "Open tool",
    },
    {
      name: "JSON to CSV Converter",
      description: "Flatten JSON data into spreadsheet-ready CSV.",
      href: "/tools/json-to-csv",
      status: "Open tool",
    },
    {
      name: "JWT Decoder",
      description: "Inspect JWT headers, payloads, and expiration locally.",
      href: "/tools/jwt-decoder",
      status: "Open tool",
    },
    {
      name: "Timestamp Converter",
      description: "Convert Unix timestamps, dates, and timezones instantly.",
      href: "/tools/timestamp-converter",
      status: "Open tool",
    },
    {
      name: "CIDR Calculator",
      description: "Calculate network ranges, masks, and usable IP addresses.",
      href: "/tools/cidr-calculator",
      status: "Open tool",
    },
    {
      name: "Cron Expression Tool",
      description: "Build cron expressions and preview upcoming run times.",
      href: "/tools/cron-expression-tool",
      status: "Open tool",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SiteHeader switchHref="/zh" />
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Simple tools.
          <span className="block text-emerald-400">Practical results.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
          Free online tools that help you solve everyday tasks quickly, without
          unnecessary complexity.
        </p>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="mt-2 text-slate-400">{tool.description}</p>
              <p className="mt-5 text-sm font-medium text-emerald-400">
                {tool.status}
                {tool.href !== "#" && (
                  <span className="ml-1 inline-block transition group-hover:translate-x-1">
                    {"\u2192"}
                  </span>
                )}
              </p>
            </Link>
          ))}
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-slate-500">
          {"\u00a9"} {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </main>
    </div>
  );
}
