import type { Metadata } from "next";
import JsonToCsv from "@/components/JsonToCsv";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online — Practical Tool Lab",
  description:
    "Convert JSON arrays to CSV online. Flatten nested objects, preview columns, and download a spreadsheet-ready CSV without uploading your data.",
  alternates: {
    canonical: "/tools/json-to-csv",
    languages: {
      en: "/tools/json-to-csv",
      "zh-CN": "/zh/tools/json-to-csv",
    },
  },
};

export default function JsonToCsvPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          switchHref="/zh/tools/json-to-csv"
          badge="100% local processing"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / Data conversion
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            JSON to CSV <span className="text-slate-500">Converter</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Turn JSON objects into clean, spreadsheet-ready CSV with nested
            fields flattened automatically.
          </p>
        </header>

        <JsonToCsv />

        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            [
              "Nested data handled",
              "Flatten nested objects into dot-separated columns while preserving arrays as readable JSON.",
            ],
            [
              "Spreadsheet ready",
              "Values are escaped correctly and downloads include UTF-8 support for international text.",
            ],
            [
              "Private by design",
              "Conversion happens inside your browser, so sensitive data never reaches our servers.",
            ],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold">How to convert JSON to CSV</h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
            <li><strong className="text-slate-200">1. Add JSON.</strong> Paste an array of objects or open a local JSON file.</li>
            <li><strong className="text-slate-200">2. Review columns.</strong> Choose a delimiter and decide whether to flatten nested objects.</li>
            <li><strong className="text-slate-200">3. Export.</strong> Copy the generated CSV or download it for Excel, Sheets, or another data tool.</li>
          </ol>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
