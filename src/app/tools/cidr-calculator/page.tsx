import type { Metadata } from "next";
import Link from "next/link";
import CidrCalculator from "@/components/CidrCalculator";

export const metadata: Metadata = {
  title: "CIDR & IPv4 Subnet Calculator — Practical Tool Lab",
  description:
    "Calculate IPv4 network addresses, broadcast addresses, subnet masks, host ranges, and split CIDR blocks into smaller subnets.",
  alternates: { canonical: "/tools/cidr-calculator" },
};

export default function CidrCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav className="mb-12 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Practical Tool Lab
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            IPv4
          </div>
        </nav>
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            Network tools / Subnetting
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            CIDR &amp; Subnet <span className="text-slate-500">Calculator</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Turn an IPv4 address and prefix into a complete network plan, then
            split the range into smaller subnets.
          </p>
        </header>
        <CidrCalculator />
        <section className="mx-auto max-w-3xl py-20">
          <h2 className="text-2xl font-bold tracking-tight">
            What does CIDR mean?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            CIDR notation combines an IP address with a prefix length. For
            example, /24 reserves 24 bits for the network and leaves 8 bits for
            host addresses, producing 256 total IPv4 addresses.
          </p>
        </section>
        <footer className="border-t border-white/10 py-8 text-sm text-slate-600">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </div>
    </main>
  );
}
