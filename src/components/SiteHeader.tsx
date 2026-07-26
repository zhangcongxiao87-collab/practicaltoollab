import Link from "next/link";

export default function SiteHeader({
  locale = "en",
  switchHref,
  badge,
}: {
  locale?: "en" | "zh";
  switchHref: string;
  badge?: string;
}) {
  return (
    <nav className="mb-12 flex items-center justify-between gap-4">
      <Link
        href={locale === "zh" ? "/zh" : "/"}
        className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400"
      >
        Practical Tool Lab
      </Link>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-4 text-xs text-slate-500 md:flex">
          <Link href={locale === "zh" ? "/zh/workbench" : "/workbench"} className="font-medium text-emerald-300/80 hover:text-emerald-300">
            {locale === "zh" ? "工作台" : "Workbench"}
          </Link>
          <Link href={locale === "zh" ? "/zh/about" : "/about"} className="hover:text-white">
            {locale === "zh" ? "关于" : "About"}
          </Link>
          <Link href={locale === "zh" ? "/zh/contact" : "/contact"} className="hover:text-white">
            {locale === "zh" ? "联系" : "Contact"}
          </Link>
          <Link href={locale === "zh" ? "/zh/privacy" : "/privacy"} className="hover:text-white">
            {locale === "zh" ? "隐私" : "Privacy"}
          </Link>
        </div>
        {badge && (
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {badge}
          </span>
        )}
        <Link
          href={switchHref}
          hrefLang={locale === "zh" ? "en" : "zh-CN"}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
        >
          {locale === "zh" ? "EN" : "中文"}
        </Link>
      </div>
    </nav>
  );
}
