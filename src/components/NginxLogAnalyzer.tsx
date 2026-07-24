"use client";

import { ChangeEvent, useMemo, useState } from "react";

type LogEntry = {
  ip: string;
  time: string;
  method: string;
  path: string;
  protocol: string;
  status: number;
  bytes: number;
  referer: string;
  userAgent: string;
  raw: string;
};

const SAMPLE = `203.0.113.10 - - [25/Jul/2026:09:15:01 +0800] "GET / HTTP/1.1" 200 4821 "-" "Mozilla/5.0"
203.0.113.11 - - [25/Jul/2026:09:15:04 +0800] "GET /tools/json-formatter HTTP/1.1" 200 9214 "https://www.google.com/" "Mozilla/5.0"
198.51.100.24 - - [25/Jul/2026:09:15:10 +0800] "POST /api/convert HTTP/1.1" 201 348 "-" "curl/8.4.0"
203.0.113.11 - - [25/Jul/2026:09:15:18 +0800] "GET /tools/json-formatter HTTP/1.1" 200 9214 "-" "Mozilla/5.0"
192.0.2.42 - - [25/Jul/2026:09:15:25 +0800] "GET /missing-page HTTP/1.1" 404 512 "-" "Mozilla/5.0"
198.51.100.24 - - [25/Jul/2026:09:15:31 +0800] "GET /api/status HTTP/1.1" 500 128 "-" "curl/8.4.0"
203.0.113.10 - - [25/Jul/2026:09:15:45 +0800] "GET /favicon.ico HTTP/1.1" 304 0 "https://practicaltoollab.com/" "Mozilla/5.0"
192.0.2.18 - - [25/Jul/2026:09:15:52 +0800] "GET /tools/jwt-decoder HTTP/2.0" 200 10482 "https://www.google.com/" "Mozilla/5.0"`;

const copy = {
  en: {
    analyze: "Analyze logs",
    sample: "Load sample",
    open: "Open log file",
    clear: "Clear",
    input: "Nginx access log",
    placeholder: "Paste Nginx combined or common access logs here…",
    requests: "Requests",
    unique: "Unique IPs",
    bandwidth: "Bandwidth",
    errors: "4xx / 5xx",
    success: "Success rate",
    status: "Status codes",
    paths: "Top paths",
    recent: "Request details",
    filter: "Filter paths, IPs, methods, or status…",
    all: "All",
    errorsOnly: "Errors only",
    method: "Method",
    path: "Path",
    code: "Status",
    size: "Size",
    ip: "Client IP",
    time: "Time",
    parsed: "parsed lines",
    skipped: "skipped",
    local: "Analyzed locally in your browser",
    empty: "Add access log lines to see traffic insights.",
    noResults: "No requests match this filter.",
  },
  zh: {
    analyze: "分析日志",
    sample: "载入示例",
    open: "打开日志文件",
    clear: "清空",
    input: "Nginx 访问日志",
    placeholder: "在这里粘贴 Nginx combined 或 common 格式访问日志…",
    requests: "请求数",
    unique: "独立 IP",
    bandwidth: "流量",
    errors: "4xx / 5xx",
    success: "成功率",
    status: "状态码分布",
    paths: "热门路径",
    recent: "请求明细",
    filter: "筛选路径、IP、方法或状态码…",
    all: "全部",
    errorsOnly: "仅看错误",
    method: "方法",
    path: "路径",
    code: "状态码",
    size: "大小",
    ip: "客户端 IP",
    time: "时间",
    parsed: "行已解析",
    skipped: "行跳过",
    local: "仅在浏览器本地分析",
    empty: "添加访问日志后即可查看流量分析。",
    noResults: "没有符合筛选条件的请求。",
  },
} as const;

function parseLine(line: string): LogEntry | null {
  const match = line.match(
    /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"(\S+)\s+([^"]*?)\s+(\S+)"\s+(\d{3})\s+(\d+|-)(?:\s+"([^"]*)"\s+"([^"]*)")?$/,
  );
  if (!match) return null;
  return {
    ip: match[1],
    time: match[2],
    method: match[3],
    path: match[4],
    protocol: match[5],
    status: Number(match[6]),
    bytes: match[7] === "-" ? 0 : Number(match[7]),
    referer: match[8] ?? "",
    userAgent: match[9] ?? "",
    raw: line,
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function statusColor(status: number) {
  if (status >= 500) return "text-rose-300 bg-rose-400/10";
  if (status >= 400) return "text-amber-300 bg-amber-400/10";
  if (status >= 300) return "text-sky-300 bg-sky-400/10";
  return "text-emerald-300 bg-emerald-400/10";
}

export default function NginxLogAnalyzer({
  locale = "en",
}: {
  locale?: "en" | "zh";
}) {
  const t = copy[locale];
  const [input, setInput] = useState(SAMPLE);
  const [query, setQuery] = useState("");
  const [errorsOnly, setErrorsOnly] = useState(false);

  const analysis = useMemo(() => {
    const lines = input.split(/\r?\n/).filter((line) => line.trim());
    const entries = lines.map(parseLine).filter((entry): entry is LogEntry => Boolean(entry));
    const statusCounts = new Map<number, number>();
    const pathCounts = new Map<string, number>();
    let bytes = 0;
    for (const entry of entries) {
      statusCounts.set(entry.status, (statusCounts.get(entry.status) ?? 0) + 1);
      const pathname = entry.path.split("?")[0];
      pathCounts.set(pathname, (pathCounts.get(pathname) ?? 0) + 1);
      bytes += entry.bytes;
    }
    const errors = entries.filter((entry) => entry.status >= 400).length;
    return {
      entries,
      skipped: lines.length - entries.length,
      bytes,
      errors,
      uniqueIps: new Set(entries.map((entry) => entry.ip)).size,
      successRate: entries.length
        ? ((entries.filter((entry) => entry.status < 400).length / entries.length) * 100).toFixed(1)
        : "0.0",
      statuses: [...statusCounts.entries()].sort((a, b) => a[0] - b[0]),
      paths: [...pathCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
    };
  }, [input]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return analysis.entries.filter((entry) => {
      if (errorsOnly && entry.status < 400) return false;
      return (
        !needle ||
        `${entry.ip} ${entry.method} ${entry.path} ${entry.status}`
          .toLowerCase()
          .includes(needle)
      );
    });
  }, [analysis.entries, errorsOnly, query]);

  function openFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setInput(String(reader.result ?? ""));
      reader.readAsText(file);
    }
    event.target.value = "";
  }

  const maxPathCount = Math.max(...analysis.paths.map(([, count]) => count), 1);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/20 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!analysis.entries.length}
            onClick={() =>
              document
                .getElementById("log-insights")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-40"
          >
            {t.analyze}
          </button>
          <button type="button" className="tool-button" onClick={() => setInput(SAMPLE)}>
            {t.sample}
          </button>
          <label className="tool-button cursor-pointer">
            {t.open}
            <input
              type="file"
              accept=".log,.txt,text/plain"
              onChange={openFile}
              className="sr-only"
            />
          </label>
          <button type="button" className="tool-button" onClick={() => setInput("")}>
            {t.clear}
          </button>
        </div>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.local}
        </span>
      </div>

      <section>
        <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
          <span className="text-sm font-medium">{t.input}</span>
          <span className="text-xs text-slate-500">
            {analysis.entries.length} {t.parsed}
            {analysis.skipped > 0 && ` · ${analysis.skipped} ${t.skipped}`}
          </span>
        </div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          aria-label={t.input}
          placeholder={t.placeholder}
          className="h-72 w-full resize-y bg-transparent p-5 font-mono text-xs leading-6 text-slate-300 outline-none placeholder:text-slate-700"
        />
      </section>

      <section id="log-insights" className="scroll-mt-4 border-t border-white/10 p-4 sm:p-5">
        {analysis.entries.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 text-sm text-slate-500">
            {t.empty}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[
                [t.requests, String(analysis.entries.length)],
                [t.unique, String(analysis.uniqueIps)],
                [t.bandwidth, formatBytes(analysis.bytes)],
                [t.errors, String(analysis.errors)],
                [t.success, `${analysis.successRate}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <h2 className="text-sm font-semibold">{t.status}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.statuses.map(([status, count]) => (
                    <div key={status} className={`rounded-xl px-3 py-2 ${statusColor(status)}`}>
                      <span className="font-mono text-sm font-semibold">{status}</span>
                      <span className="ml-2 text-xs opacity-70">{count}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <h2 className="text-sm font-semibold">{t.paths}</h2>
                <div className="mt-4 space-y-3">
                  {analysis.paths.map(([path, count]) => (
                    <div key={path}>
                      <div className="mb-1 flex justify-between gap-3 font-mono text-xs text-slate-400">
                        <span className="truncate">{path}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{ width: `${(count / maxPathCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <article className="overflow-hidden rounded-2xl border border-white/10">
              <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-semibold">{t.recent}</h2>
                <div className="flex gap-2">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t.filter}
                    className="min-w-64 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none placeholder:text-slate-600 focus:border-emerald-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setErrorsOnly((current) => !current)}
                    className={`rounded-xl border px-3 py-2 text-xs transition ${
                      errorsOnly
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                        : "border-white/10 text-slate-400"
                    }`}
                  >
                    {errorsOnly ? t.all : t.errorsOnly}
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                {visible.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-500">{t.noResults}</p>
                ) : (
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-500">
                      <tr>
                        {[t.method, t.path, t.code, t.size, t.ip, t.time].map((heading) => (
                          <th key={heading} className="whitespace-nowrap px-4 py-3 font-medium">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {visible.slice(0, 100).map((entry, index) => (
                        <tr key={`${entry.time}-${index}`} className="hover:bg-white/[0.025]">
                          <td className="px-4 py-3 font-mono text-sky-300">{entry.method}</td>
                          <td className="max-w-80 px-4 py-3 font-mono text-slate-300">
                            <span className="block truncate" title={entry.path}>{entry.path}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-1 font-mono ${statusColor(entry.status)}`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatBytes(entry.bytes)}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-400">{entry.ip}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-500">{entry.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}
