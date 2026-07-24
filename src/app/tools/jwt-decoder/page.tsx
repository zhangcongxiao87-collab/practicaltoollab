import type { Metadata } from "next";
import JwtDecoder from "@/components/JwtDecoder";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JWT Decoder Online — Practical Tool Lab",
  description:
    "Decode JWT headers and payloads locally. Inspect expiration, issued-at, and not-before claims without sending your token to a server.",
  alternates: {
    canonical: "/tools/jwt-decoder",
    languages: {
      en: "/tools/jwt-decoder",
      "zh-CN": "/zh/tools/jwt-decoder",
    },
  },
};

export default function JwtDecoderPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader
          switchHref="/zh/tools/jwt-decoder"
          badge="100% local decoding"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Developer tools / Security
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            JWT <span className="text-slate-500">Decoder</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Read a JSON Web Token&apos;s header, payload, timestamps, and
            signature section without uploading it anywhere.
          </p>
        </header>

        <JwtDecoder />

        <section className="grid gap-4 py-20 md:grid-cols-3">
          {[
            ["Readable claims", "Pretty-print header and payload JSON and turn Unix time claims into readable dates."],
            ["Expiration at a glance", "Immediately see whether a token is expired, active, or has no expiration claim."],
            ["Safe expectations", "Decoding is clearly separated from signature verification so readable data is never presented as trusted."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold">What this JWT decoder does</h2>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            JWTs contain Base64URL-encoded sections that can be read without a
            secret key. This tool decodes those sections for debugging. It does
            not verify the cryptographic signature, issuer, audience, or any
            other security property. Always validate tokens in your application.
          </p>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
