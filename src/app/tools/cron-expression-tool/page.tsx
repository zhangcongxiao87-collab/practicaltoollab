import type { Metadata } from "next";
import CronExpressionTool from "@/components/CronExpressionTool";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Cron Expression Generator & Parser — Practical Tool Lab",
  description:
    "Build, validate, and explain five-part cron expressions. Preview upcoming run times in multiple timezones.",
  alternates: {
    canonical: "/tools/cron-expression-tool",
    languages: {
      en: "/tools/cron-expression-tool",
      "zh-CN": "/zh/tools/cron-expression-tool",
    },
  },
};

export default function CronExpressionToolPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SiteHeader
          switchHref="/zh/tools/cron-expression-tool"
          badge="5-part cron"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / Scheduling
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Cron Expression <span className="text-slate-500">Tool</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Build and validate cron schedules, understand what they mean, and
            preview upcoming runs before adding them to production.
          </p>
        </header>
        <CronExpressionTool />
        <section className="mx-auto max-w-3xl py-20">
          <h2 className="text-2xl font-bold tracking-tight">
            Understanding the five cron fields
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            A standard cron expression contains minute, hour, day of month,
            month, and day of week. An asterisk means every allowed value, a
            slash adds an interval, a hyphen defines a range, and commas create
            a list.
          </p>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
