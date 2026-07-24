import Link from "next/link";

const tools = [
  ["JSON Formatter", "JSON 格式化", "json-formatter"],
  ["JSON Diff", "JSON 对比", "json-diff"],
  ["JSON to CSV", "JSON 转 CSV", "json-to-csv"],
  ["JWT Decoder", "JWT 解码", "jwt-decoder"],
  ["Base64", "Base64 编解码", "base64-encoder-decoder"],
  ["URL Encoder", "URL 编解码", "url-encoder-decoder"],
  ["Regex Tester", "正则测试", "regex-tester"],
  ["Timestamp", "时间戳转换", "timestamp-converter"],
  ["CIDR Calculator", "CIDR 计算器", "cidr-calculator"],
  ["Cron Tool", "Cron 工具", "cron-expression-tool"],
  ["Nginx Logs", "Nginx 日志", "nginx-log-analyzer"],
];

export default function ToolsDirectory({ locale }: { locale: "en" | "zh" }) {
  return (
    <aside className="bg-slate-950 px-4 pb-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] border-t border-white/10 pt-10">
        <h2 className="text-lg font-semibold">{locale === "zh" ? "探索更多工具" : "Explore more tools"}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {tools.map(([en, zh, slug]) => (
            <Link key={slug} href={`${locale === "zh" ? "/zh" : ""}/tools/${slug}`} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 transition hover:border-emerald-400/30 hover:text-emerald-300">
              {locale === "zh" ? zh : en}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
