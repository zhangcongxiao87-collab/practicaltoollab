import type { Metadata } from "next";
import Link from "next/link";
import TimestampConverter from "@/components/TimestampConverter";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Practical Tool Lab",
  description:
    "Convert Unix timestamps to readable dates and dates back to seconds or milliseconds. Includes timezones and batch conversion.",
  alternates: { canonical: "/tools/timestamp-converter" },
};

export default function TimestampConverterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400"
          >
            Practical Tool Lab
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Browser-based
          </div>
        </nav>
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / Date &amp; time
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Unix Timestamp <span className="text-slate-500">Converter</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Convert seconds or milliseconds into readable dates, compare
            timezones, and process multiple timestamps at once.
          </p>
        </header>
        <TimestampConverter />
        <section className="mx-auto max-w-3xl py-20">
          <h2 className="text-2xl font-bold tracking-tight">
            Seconds or milliseconds?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Unix timestamps count time from January 1, 1970 UTC. Ten-digit
            values normally represent seconds, while thirteen-digit values
            normally represent milliseconds. Auto mode detects the unit by
            magnitude, and you can override it at any time.
          </p>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
