import type { Metadata } from "next";
import Link from "next/link";
import JsonFormatter from "@/components/JsonFormatter";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Practical Tool Lab",
  description:
    "Format, validate, minify, sort, and explore JSON securely in your browser. Your data never leaves your device.",
  alternates: { canonical: "/tools/json-formatter" },
};

const features = [
  {
    title: "Pinpoint errors",
    description:
      "See a clear validation message with the exact line and column whenever possible.",
  },
  {
    title: "Explore as a tree",
    description:
      "Collapse deeply nested objects and arrays instead of scanning hundreds of lines.",
  },
  {
    title: "Private by design",
    description:
      "Formatting happens locally in your browser. Your JSON is never uploaded to us.",
  },
];

export default function JsonFormatterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400"
          >
            Practical Tool Lab
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            100% local processing
          </div>
        </nav>

        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / JSON
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            JSON Formatter{" "}
            <span className="text-slate-500">&amp; Validator</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Clean up messy JSON, catch syntax errors, and explore nested data
            without sending anything to a server.
          </p>
        </header>

        <JsonFormatter />

        <section className="grid gap-4 py-20 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold tracking-tight">
            How to format JSON
          </h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
            <li>
              <strong className="text-slate-200">1. Add your data.</strong>{" "}
              Paste JSON into the input editor or drop a .json file.
            </li>
            <li>
              <strong className="text-slate-200">2. Fix any errors.</strong>{" "}
              The validator shows where parsing stopped so you can correct the
              source quickly.
            </li>
            <li>
              <strong className="text-slate-200">3. Use the result.</strong>{" "}
              Format, minify, sort keys, inspect the tree, then copy or download
              the cleaned JSON.
            </li>
          </ol>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
