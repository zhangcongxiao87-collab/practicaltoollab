"use client";

import { useEffect, useMemo, useState } from "react";

type OperationId =
  | "json-format"
  | "json-minify"
  | "base64-encode"
  | "base64-decode"
  | "url-encode"
  | "url-decode";

const SAMPLE = `{"project":"Practical Tool Lab","environment":"production","status":"healthy"}`;
const INPUT_KEY = "ptl-workbench-input";
const RECIPE_KEY = "ptl-workbench-recipe";

const operations: Array<{ id: OperationId; en: string; zh: string; group: string }> = [
  { id: "json-format", en: "Format JSON", zh: "格式化 JSON", group: "JSON" },
  { id: "json-minify", en: "Minify JSON", zh: "压缩 JSON", group: "JSON" },
  { id: "base64-encode", en: "Base64 Encode", zh: "Base64 编码", group: "Base64" },
  { id: "base64-decode", en: "Base64 Decode", zh: "Base64 解码", group: "Base64" },
  { id: "url-encode", en: "URL Encode", zh: "URL 编码", group: "URL" },
  { id: "url-decode", en: "URL Decode", zh: "URL 解码", group: "URL" },
];

const labels = {
  en: {
    input: "Input", output: "Output", operations: "Add an operation",
    pipeline: "Your workflow", empty: "Add operations to build a reusable workflow.",
    sample: "Load sample", clear: "Clear", copy: "Copy", copied: "Copied!",
    download: "Download", save: "Save workflow", saved: "Saved locally",
    reset: "Reset workflow", remove: "Remove", local: "Input and workflows stay on this device",
    error: "This step could not process the current value.",
  },
  zh: {
    input: "输入", output: "输出", operations: "添加操作",
    pipeline: "你的工作流", empty: "添加操作，构建可重复使用的处理流程。",
    sample: "加载示例", clear: "清空", copy: "复制", copied: "已复制",
    download: "下载", save: "保存工作流", saved: "已保存到本地",
    reset: "重置流程", remove: "移除", local: "输入数据和工作流仅保存在此设备",
    error: "当前步骤无法处理输入内容。",
  },
} as const;

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function runOperation(id: OperationId, value: string) {
  switch (id) {
    case "json-format": return JSON.stringify(JSON.parse(value), null, 2);
    case "json-minify": return JSON.stringify(JSON.parse(value));
    case "base64-encode": return encodeBase64(value);
    case "base64-decode": return decodeBase64(value);
    case "url-encode": return encodeURIComponent(value);
    case "url-decode": return decodeURIComponent(value);
  }
}

export default function Workbench({ locale = "en" }: { locale?: "en" | "zh" }) {
  const t = labels[locale];
  const [input, setInput] = useState(SAMPLE);
  const [steps, setSteps] = useState<OperationId[]>(["json-format"]);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const transferred = window.localStorage.getItem(INPUT_KEY);
      const recipe = window.localStorage.getItem(RECIPE_KEY);
      if (transferred) {
        setInput(transferred);
        window.localStorage.removeItem(INPUT_KEY);
      }
      if (recipe) {
        try {
          const parsed = JSON.parse(recipe) as OperationId[];
          if (Array.isArray(parsed)) setSteps(parsed);
        } catch {
          window.localStorage.removeItem(RECIPE_KEY);
        }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const result = useMemo(() => {
    try {
      return { ok: true as const, value: steps.reduce((value, step) => runOperation(step, value), input) };
    } catch {
      return { ok: false as const, value: "" };
    }
  }, [input, steps]);

  async function copyOutput() {
    if (!result.ok) return;
    await navigator.clipboard.writeText(result.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  function saveRecipe() {
    window.localStorage.setItem(RECIPE_KEY, JSON.stringify(steps));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  function downloadOutput() {
    if (!result.ok) return;
    const url = URL.createObjectURL(new Blob([result.value], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "workbench-output.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/20">
      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t.operations}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {operations.map((operation) => (
              <button
                key={operation.id}
                type="button"
                onClick={() => setSteps((current) => [...current, operation.id])}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-left text-sm text-slate-300 transition hover:border-emerald-400/30 hover:text-white"
              >
                <span>{locale === "zh" ? operation.zh : operation.en}</span>
                <span className="text-xs text-slate-600">+</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3 text-xs leading-5 text-emerald-200/70">{t.local}</div>
        </aside>

        <div className="min-w-0">
          <section className="border-b border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t.pipeline}</p>
                {steps.length === 0 && <p className="mt-2 text-sm text-slate-500">{t.empty}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={saveRecipe} className="tool-button">{saved ? t.saved : t.save}</button>
                <button type="button" onClick={() => setSteps([])} className="tool-button">{t.reset}</button>
              </div>
            </div>
            {steps.length > 0 && (
              <ol className="mt-4 flex flex-wrap items-center gap-2">
                {steps.map((step, index) => {
                  const operation = operations.find((item) => item.id === step)!;
                  return (
                    <li key={`${step}-${index}`} className="flex items-center gap-2">
                      {index > 0 && <span className="text-slate-700">→</span>}
                      <button
                        type="button"
                        title={t.remove}
                        onClick={() => setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:border-rose-400/30 hover:text-rose-300"
                      >
                        {locale === "zh" ? operation.zh : operation.en} ×
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <div className="grid lg:grid-cols-2">
            <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
                <span className="text-sm font-medium">{t.input}</span>
                <div className="flex gap-3 text-xs text-slate-400">
                  <button type="button" onClick={() => setInput(SAMPLE)}>{t.sample}</button>
                  <button type="button" onClick={() => setInput("")}>{t.clear}</button>
                </div>
              </div>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label={t.input} spellCheck={false} className="h-[420px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-slate-200 outline-none" />
            </section>
            <section>
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
                <span className="text-sm font-medium">{t.output}</span>
                <div className="flex gap-3">
                  <button type="button" disabled={!result.ok} onClick={downloadOutput} className="text-xs text-slate-400 disabled:opacity-40">{t.download}</button>
                  <button type="button" disabled={!result.ok} onClick={copyOutput} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40">{copied ? t.copied : t.copy}</button>
                </div>
              </div>
              <div className="h-[420px] overflow-auto p-5">
                {result.ok ? <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-7 text-slate-200">{result.value}</pre> : <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-300">{t.error}</div>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
