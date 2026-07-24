"use client";

import { useMemo, useState } from "react";

const SAMPLE = "Contact support@example.com or sales@practicaltoollab.com for help.";
const labels = {
  en: { pattern: "Regular expression", text: "Test text", replacement: "Replacement", result: "Matches", replacePreview: "Replacement preview", matches: "matches", no: "No matches", invalid: "Invalid expression", sample: "Email example", clear: "Clear", groups: "Groups", index: "Index", local: "Evaluated locally" },
  zh: { pattern: "正则表达式", text: "测试文本", replacement: "替换内容", result: "匹配结果", replacePreview: "替换预览", matches: "个匹配", no: "没有匹配", invalid: "表达式无效", sample: "邮箱示例", clear: "清空", groups: "捕获组", index: "位置", local: "仅在本地执行" },
} as const;

export default function RegexTester({ locale = "en" }: { locale?: "en" | "zh" }) {
  const t = labels[locale];
  const [pattern, setPattern] = useState("[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState(SAMPLE);
  const [replacement, setReplacement] = useState("[email]");
  const analysis = useMemo(() => {
    try {
      const matchFlags = flags.includes("g") ? flags : `${flags}g`;
      const regex = new RegExp(pattern, matchFlags);
      const matches = [...text.matchAll(regex)].slice(0, 500);
      const replaceRegex = new RegExp(pattern, flags);
      return { ok: true as const, matches, replaced: text.replace(replaceRegex, replacement) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : t.invalid };
    }
  }, [flags, pattern, replacement, t.invalid, text]);
  function toggleFlag(flag: string) {
    setFlags((current) => current.includes(flag) ? current.replace(flag, "") : `${current}${flag}`);
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-violet-950/20">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3">
          <span className="font-mono text-emerald-400">/</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} aria-label={t.pattern} className="min-w-0 flex-1 bg-transparent py-3 font-mono text-sm outline-none" />
          <span className="font-mono text-emerald-400">/{flags}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {["g", "i", "m", "s", "u"].map((flag) => <button key={flag} onClick={() => toggleFlag(flag)} className={`h-8 w-8 rounded-lg border font-mono text-xs ${flags.includes(flag) ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-500"}`}>{flag}</button>)}
          </div>
          <div className="flex gap-3 text-xs text-slate-400"><button onClick={() => { setPattern("[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}"); setText(SAMPLE); }}>{t.sample}</button><button onClick={() => setText("")}>{t.clear}</button><span>{t.local}</span></div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2">
        <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4"><span className="text-sm font-medium">{t.text}</span>{analysis.ok && <span className="text-xs text-emerald-300">{analysis.matches.length} {t.matches}</span>}</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} aria-label={t.text} spellCheck={false} className="h-72 w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 outline-none" />
          <div className="border-t border-white/10 p-4">
            <label className="mb-2 block text-xs text-slate-500">{t.replacement}</label>
            <input value={replacement} onChange={(e) => setReplacement(e.target.value)} aria-label={t.replacement} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-400/40" />
          </div>
        </section>
        <section className="min-w-0">
          <div className="flex h-12 items-center border-b border-white/10 px-4 text-sm font-medium">{t.result}</div>
          <div className="h-72 overflow-auto p-4">
            {!analysis.ok ? <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-300">{t.invalid}: {analysis.error}</div> : analysis.matches.length === 0 ? <p className="text-sm text-slate-500">{t.no}</p> : <div className="space-y-2">{analysis.matches.map((match, i) => <div key={`${match.index}-${i}`} className="rounded-xl border border-white/10 bg-slate-950/50 p-3"><div className="flex justify-between gap-3"><code className="break-all text-xs text-emerald-300">{match[0]}</code><span className="whitespace-nowrap text-[10px] text-slate-600">{t.index} {match.index}</span></div>{match.length > 1 && <p className="mt-2 text-[10px] text-slate-500">{t.groups}: {match.slice(1).map((group) => group ?? "—").join(" · ")}</p>}</div>)}</div>}
          </div>
          <div className="border-t border-white/10 p-4"><p className="mb-2 text-xs text-slate-500">{t.replacePreview}</p><pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-300">{analysis.ok ? analysis.replaced : "—"}</pre></div>
        </section>
      </div>
    </div>
  );
}
