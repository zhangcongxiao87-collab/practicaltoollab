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
        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold">How to decode a JWT</h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
            <li><strong className="text-slate-200">1. Copy the complete token.</strong> A JWT normally has three dot-separated parts: header, payload, and signature.</li>
            <li><strong className="text-slate-200">2. Paste it into the decoder.</strong> The header and payload become readable JSON, while time claims are shown as dates.</li>
            <li><strong className="text-slate-200">3. Check the claims.</strong> Compare <code className="text-emerald-300">exp</code>, <code className="text-emerald-300">iat</code>, <code className="text-emerald-300">nbf</code>, <code className="text-emerald-300">iss</code>, and <code className="text-emerald-300">aud</code> with what your application expects.</li>
          </ol>
        </section>
        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <p className="text-sm font-medium text-emerald-400">Common use cases</p>
          <h2 className="mt-3 text-2xl font-bold">Use JWT decoding for diagnosis, not trust</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              ["Investigate a 401 response", "Confirm whether an access token expired, is not active yet, or was issued for the wrong audience."],
              ["Check OAuth and OpenID Connect claims", "Inspect the token shape during an identity-provider integration and compare the expected issuer, subject, and scopes."],
              ["Debug local development", "Verify the claims a test environment produced before adding logs or pasting sensitive tokens into an issue tracker."],
              ["Explain token behavior to a team", "Copy only the non-sensitive decoded fields into internal documentation to show why a session succeeded or failed."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-3xl border-t border-white/10 py-16">
          <h2 className="text-2xl font-bold">JWT Decoder FAQ</h2>
          <div className="mt-6 space-y-4">
            {[
              ["Does decoding verify a JWT?", "No. Anyone can Base64URL-decode a JWT header and payload. Verification requires checking the token signature and your application&apos;s issuer, audience, algorithm, and expiration rules."],
              ["Should I paste a production token here?", "This tool processes the token locally, but a production token may still grant access if copied elsewhere. Prefer a short-lived test token whenever possible and revoke a token if you believe it was exposed."],
              ["Why does my token show an unexpected time?", "JWT time claims are Unix timestamps in seconds. Check your server clock, time zone display, and whether the token&apos;s exp or nbf claim was generated in milliseconds by mistake."],
            ].map(([question, answer]) => (
              <article key={question} className="rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold">{question}</h3>
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
