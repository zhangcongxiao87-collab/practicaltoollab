import type { Metadata } from "next";
import Base64Tool from "@/components/Base64Tool";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder Online — Practical Tool Lab",
  description:
    "Encode UTF-8 text to Base64 or decode Base64 online, including URL-safe output. Fast, private, and processed entirely in your browser.",
  alternates: {
    canonical: "/tools/base64-encoder-decoder",
    languages: {
      en: "/tools/base64-encoder-decoder",
      "zh-CN": "/zh/tools/base64-encoder-decoder",
    },
  },
};

export default function Base64Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          switchHref="/zh/tools/base64-encoder-decoder"
          badge="100% local processing"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / Encoding
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Base64 <span className="text-slate-500">Encoder &amp; Decoder</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Convert Unicode text to standard or URL-safe Base64 and decode it
            back without sending data to a server.
          </p>
        </header>
        <Base64Tool />
        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["Unicode friendly", "Correctly encode and decode UTF-8 text, including Chinese, emoji, and international characters."],
            ["URL-safe output", "Replace unsafe URL characters and remove padding for tokens, query strings, and filenames."],
            ["Private by design", "All encoding and decoding happens inside your browser, even for sensitive values."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold">What is Base64?</h2>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            Base64 represents binary data using printable text characters. It is
            useful for transport and embedding, but it is not encryption and
            does not protect secrets from being read.
          </p>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
