"use client";

import { useMemo, useState } from "react";

const SAMPLE = "Practical Tool Lab — Simple tools. Practical results. 实用工具。";

const copy = {
  en: {
    encode: "Encode",
    decode: "Decode",
    input: "Input",
    output: "Result",
    encodePlaceholder: "Enter text to encode…",
    decodePlaceholder: "Paste Base64 to decode…",
    sample: "Load sample",
    clear: "Clear",
    swap: "Use result as input",
    copy: "Copy result",
    copied: "Copied!",
    download: "Download result",
    urlSafe: "URL-safe Base64",
    valid: "Valid Base64",
    invalid: "Invalid Base64 input",
    characters: "characters",
    bytes: "bytes",
    local: "Processed locally in your browser",
    encoding: "UTF-8 text",
  },
  zh: {
    encode: "编码",
    decode: "解码",
    input: "输入",
    output: "结果",
    encodePlaceholder: "输入需要编码的文本…",
    decodePlaceholder: "粘贴需要解码的 Base64…",
    sample: "载入示例",
    clear: "清空",
    swap: "将结果作为输入",
    copy: "复制结果",
    copied: "已复制",
    download: "下载结果",
    urlSafe: "URL 安全 Base64",
    valid: "Base64 有效",
    invalid: "Base64 输入无效",
    characters: "字符",
    bytes: "字节",
    local: "仅在浏览器本地处理",
    encoding: "UTF-8 文本",
  },
} as const;

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function encodeText(value: string, urlSafe: boolean) {
  const encoded = bytesToBase64(new TextEncoder().encode(value));
  return urlSafe
    ? encoded.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")
    : encoded;
}

function decodeText(value: string) {
  const compact = value.replace(/\s/g, "").replaceAll("-", "+").replaceAll("_", "/");
  if (!compact) return "";
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact)) {
    throw new Error("Invalid Base64 characters.");
  }
  const padded = compact.padEnd(Math.ceil(compact.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64Tool({
  locale = "en",
}: {
  locale?: "en" | "zh";
}) {
  const t = copy[locale];
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(SAMPLE);
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: mode === "encode" ? encodeText(input, urlSafe) : decodeText(input),
      };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof Error ? error.message : t.invalid,
      };
    }
  }, [input, mode, t.invalid, urlSafe]);

  function switchMode(nextMode: "encode" | "decode") {
    setMode(nextMode);
    if (result.ok && input) setInput(result.value);
  }

  async function copyResult() {
    if (!result.ok || !result.value) return;
    await navigator.clipboard.writeText(result.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function download() {
    if (!result.ok || !result.value) return;
    const url = URL.createObjectURL(
      new Blob([result.value], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = mode === "encode" ? "encoded-base64.txt" : "decoded-text.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-sky-950/20 backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center rounded-xl bg-slate-950 p-1">
          {(["encode", "decode"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => switchMode(option)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === option
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t[option]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={urlSafe}
              disabled={mode === "decode"}
              onChange={(event) => setUrlSafe(event.target.checked)}
              className="accent-emerald-400 disabled:opacity-40"
            />
            {t.urlSafe}
          </label>
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t.local}
          </span>
        </div>
      </div>

      <div className="grid min-h-[480px] lg:grid-cols-2">
        <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-medium">{t.input}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("encode");
                  setInput(SAMPLE);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                {t.sample}
              </button>
              <button
                type="button"
                onClick={() => setInput("")}
                className="text-xs text-slate-400 hover:text-white"
              >
                {t.clear}
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-label={t.input}
            placeholder={
              mode === "encode" ? t.encodePlaceholder : t.decodePlaceholder
            }
            className="h-[428px] w-full resize-none bg-transparent p-5 font-mono text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700"
          />
        </section>

        <section className="min-w-0">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{t.output}</span>
              {mode === "decode" && input && (
                <span
                  className={`text-xs ${result.ok ? "text-emerald-300" : "text-rose-300"}`}
                >
                  {result.ok ? t.valid : t.invalid}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!result.ok || !result.value}
                onClick={() => result.ok && setInput(result.value)}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-40"
              >
                {t.swap}
              </button>
              <button
                type="button"
                disabled={!result.ok || !result.value}
                onClick={download}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-40"
              >
                {t.download}
              </button>
              <button
                type="button"
                disabled={!result.ok || !result.value}
                onClick={copyResult}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-40"
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </div>
          <div className="h-[428px] overflow-auto p-5">
            {result.ok ? (
              <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-7 text-slate-200">
                {result.value}
              </pre>
            ) : (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5 text-sm text-rose-300">
                {result.error}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-slate-500">
        <span>{t.encoding}</span>
        <span>
          {input.length} {t.characters} ·{" "}
          {new TextEncoder().encode(input).length} {t.bytes}
        </span>
      </div>
    </div>
  );
}
