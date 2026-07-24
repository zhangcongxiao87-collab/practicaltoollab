import type { Metadata } from "next";
import JsonDiff from "@/components/JsonDiff";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JSON Diff & Compare Online — Practical Tool Lab",
  description:
    "Compare two JSON documents online and find added, removed, or changed values by path. Fast, private, and processed entirely in your browser.",
  alternates: {
    canonical: "/tools/json-diff",
    languages: {
      en: "/tools/json-diff",
      "zh-CN": "/zh/tools/json-diff",
    },
  },
};

const features = [
  {
    title: "Structural comparison",
    description:
      "Compare parsed data instead of raw text, so whitespace and object key order do not create false differences.",
  },
  {
    title: "Precise JSON paths",
    description:
      "Every change includes its exact object or array path, making large payloads easier to debug.",
  },
  {
    title: "Private by design",
    description:
      "Both documents stay on your device. Comparing, filtering, and exporting happen locally.",
  },
];

export default function JsonDiffPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          switchHref="/zh/tools/json-diff"
          badge="100% local processing"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / JSON
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            JSON Diff <span className="text-slate-500">&amp; Compare</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Find meaningful changes between two JSON documents without being
            distracted by formatting or object key order.
          </p>
        </header>

        <JsonDiff />

        <section className="grid gap-4 py-20 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold tracking-tight">
            How to compare JSON
          </h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
            <li>
              <strong className="text-slate-200">1. Add both documents.</strong>{" "}
              Paste JSON into each editor or open local .json files.
            </li>
            <li>
              <strong className="text-slate-200">2. Review the changes.</strong>{" "}
              Filter additions, removals, and modifications or search by path.
            </li>
            <li>
              <strong className="text-slate-200">3. Export the result.</strong>{" "}
              Copy a path or download a machine-readable JSON difference report.
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
