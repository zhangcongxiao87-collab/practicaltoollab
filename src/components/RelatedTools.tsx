import Link from "next/link";

export default function RelatedTools({ locale, tools }: { locale: "en" | "zh"; tools: Array<{ name: string; href: string }> }) {
  return (
    <section className="border-t border-white/10 py-16">
      <h2 className="text-2xl font-bold">{locale === "zh" ? "相关工具" : "Related tools"}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => <Link key={tool.href} href={tool.href} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-medium text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300">{tool.name} →</Link>)}
      </div>
    </section>
  );
}
