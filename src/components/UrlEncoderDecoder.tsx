"use client";

import { useMemo, useState } from "react";

const SAMPLE = "https://example.com/search?q=JSON tools&lang=中文#results";

const labels = {
  en: {
    encode: "Encode", decode: "Decode", input: "Input", output: "Result",
    component: "URL component", full: "Full URL", sample: "Load sample",
    clear: "Clear", copy: "Copy", copied: "Copied!", use: "Use result as input",
    invalid: "Unable to decode this value.", details: "URL structure",
    protocol: "Protocol", host: "Host", path: "Path", query: "Query parameters",
    hash: "Fragment", local: "Processed locally in your browser",
  },
  zh: {
    encode: "编码", decode: "解码", input: "输入", output: "结果",
    component: "URL 组件", full: "完整 URL", sample: "载入示例",
    clear: "清空", copy: "复制", copied: "已复制", use: "将结果作为输入",
    invalid: "无法解码此内容。", details: "URL 结构",
    protocol: "协议", host: "主机", path: "路径", query: "查询参数",
    hash: "片段", local: "仅在浏览器本地处理",
  },
} as const;

export default function UrlEncoderDecoder({ locale = "en" }: { locale?: "en" | "zh" }) {
  const t = labels[locale];
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [scope, setScope] = useState<"component" | "full">("component");
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => {
    try {
      const value = mode === "encode"
        ? scope === "component" ? encodeURIComponent(input) : encodeURI(input)
        : scope === "component" ? decodeURIComponent(input) : decodeURI(input);
      return { ok: true as const, value };
    } catch {
      return { ok: false as const, value: "" };
    }
  }, [input, mode, scope]);
  const urlDetails = useMemo(() => {
    const candidate = mode === "decode" && result.ok ? result.value : input;
    try {
      const url = new URL(candidate);
      return {
        protocol: url.protocol.replace(":", ""),
        host: url.host,
        path: url.pathname,
        hash: url.hash || "—",
        params: [...url.searchParams.entries()],
      };
    } catch { return null; }
  }, [input, mode, result]);

  function changeMode(next: "encode" | "decode") {
    if (result.ok && input) setInput(result.value);
    setMode(next);
  }
  async function copyResult() {
    if (!result.ok) return;
    await navigator.clipboard.writeText(result.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-sky-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
        <div className="flex rounded-xl bg-slate-950 p-1">
          {(["encode", "decode"] as const).map((option) => (
            <button key={option} onClick={() => changeMode(option)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === option ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}>
              {t[option]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <select value={scope} onChange={(e) => setScope(e.target.value as "component" | "full")} className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 outline-none">
            <option value="component">{t.component}</option>
            <option value="full">{t.full}</option>
          </select>
          <span className="hidden sm:inline">{t.local}</span>
        </div>
      </div>
      <div className="grid lg:grid-cols-2">
        <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-medium">{t.input}</span>
            <div className="flex gap-3 text-xs text-slate-400">
              <button onClick={() => setInput(SAMPLE)}>{t.sample}</button>
              <button onClick={() => setInput("")}>{t.clear}</button>
            </div>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} aria-label={t.input} spellCheck={false} className="h-72 w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 outline-none" />
        </section>
        <section>
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-medium">{t.output}</span>
            <div className="flex gap-3">
              <button disabled={!result.ok} onClick={() => result.ok && setInput(result.value)} className="text-xs text-slate-400 disabled:opacity-40">{t.use}</button>
              <button disabled={!result.ok} onClick={copyResult} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs disabled:opacity-40">{copied ? t.copied : t.copy}</button>
            </div>
          </div>
          <div className="h-72 overflow-auto p-5">
            {result.ok ? <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-7 text-slate-200">{result.value}</pre> : <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-300">{t.invalid}</div>}
          </div>
        </section>
      </div>
      {urlDetails && (
        <section className="border-t border-white/10 p-5">
          <h2 className="text-sm font-semibold">{t.details}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[[t.protocol, urlDetails.protocol], [t.host, urlDetails.host], [t.path, urlDetails.path], [t.hash, urlDetails.hash]].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <p className="text-[10px] uppercase text-slate-600">{label}</p><p className="mt-1 truncate font-mono text-xs text-slate-300">{value}</p>
              </div>
            ))}
          </div>
          {urlDetails.params.length > 0 && <div className="mt-4 rounded-xl border border-white/10 p-3"><p className="mb-2 text-xs text-slate-500">{t.query}</p>{urlDetails.params.map(([key, value], index) => <p key={`${key}-${index}`} className="font-mono text-xs leading-6"><span className="text-violet-300">{key}</span><span className="text-slate-600"> = </span><span className="text-emerald-300">{value}</span></p>)}</div>}
        </section>
      )}
    </div>
  );
}
