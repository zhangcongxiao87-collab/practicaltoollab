import type { Metadata } from "next";
import JsonFormatter from "@/components/JsonFormatter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Practical Tool Lab",
  description:
    "Format, validate, minify, sort, and explore JSON securely in your browser. Your data never leaves your device.",
  alternates: {
    canonical: "/tools/json-formatter",
    languages: {
      en: "/tools/json-formatter",
      "zh-CN": "/zh/tools/json-formatter",
    },
  },
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
        <SiteHeader
          switchHref="/zh/tools/json-formatter"
          badge="100% local processing"
        />

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

        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <p className="text-sm font-medium text-emerald-400">Common use cases</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            When a JSON formatter saves time
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              [
                "Debug an API response",
                "Paste a compact response from fetch, Postman, or your browser&apos;s network panel to spot a missing field or unexpected value.",
              ],
              [
                "Review configuration files",
                "Make package, deployment, and app configuration files readable before committing them to source control.",
              ],
              [
                "Inspect webhook payloads",
                "Expand nested event data and verify the keys your integration receives without sharing customer data with a third party.",
              ],
              [
                "Prepare JSON for a teammate",
                "Sort keys and format a clean example that is easier to paste into a bug report, ticket, or documentation page.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold tracking-tight">
            JSON Formatter FAQ
          </h2>
          <div className="mt-6 space-y-4">
            {[
              [
                "Is my JSON uploaded?",
                "No. Formatting, validation, sorting, and tree rendering run in your browser. Your input is not sent to a Practical Tool Lab server.",
              ],
              [
                "What does valid JSON require?",
                "JSON requires double-quoted property names and strings, commas between items, and no trailing comma. The validator reports where parsing stopped when it finds a problem.",
              ],
              [
                "What is the difference between format and minify?",
                "Formatting adds indentation and line breaks for people. Minifying removes unnecessary whitespace to reduce the size of a JSON payload.",
              ],
            ].map(([question, answer]) => (
              <article key={question} className="rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-white">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
