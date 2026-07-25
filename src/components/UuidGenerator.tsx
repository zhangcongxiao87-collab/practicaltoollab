"use client";

import { useMemo, useState } from "react";

const labels = {
  en: {
    amount: "Quantity", uppercase: "Uppercase", hyphens: "Include hyphens",
    generate: "Generate UUIDs", copyAll: "Copy all", copied: "Copied",
    download: "Download .txt", copy: "Copy", result: "Generated UUIDs",
    local: "Generated securely in your browser",
  },
  zh: {
    amount: "生成数量", uppercase: "大写字母", hyphens: "保留连字符",
    generate: "生成 UUID", copyAll: "复制全部", copied: "已复制",
    download: "下载 .txt", copy: "复制", result: "生成结果",
    local: "使用浏览器安全随机数在本地生成",
  },
} as const;

const INITIAL_UUIDS = [
  "0f28a3be-7b9d-4e75-927a-315b8d645e10",
  "b6c19d54-253f-46ec-a671-cf08c8d2fc94",
  "67a82b1f-c046-4fc9-83e1-1b789b846f43",
  "d32ea9bd-e5e3-4197-a65d-c56b017347c8",
  "49e4b632-2640-4bf8-b84e-e63a2e6719ab",
];

function createUuid() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

export default function UuidGenerator({ locale = "en" }: { locale?: "en" | "zh" }) {
  const t = labels[locale];
  const [amount, setAmount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [rawUuids, setRawUuids] = useState(INITIAL_UUIDS);
  const [copied, setCopied] = useState<string | null>(null);

  const uuids = useMemo(
    () =>
      rawUuids.map((rawUuid) => {
      let value = rawUuid;
      if (!hyphens) value = value.replaceAll("-", "");
      return uppercase ? value.toUpperCase() : value;
      }),
    [rawUuids, uppercase, hyphens],
  );

  function generate(nextAmount = amount) {
    setRawUuids(Array.from({ length: nextAmount }, createUuid));
  }

  function changeAmount(nextAmount: number) {
    setAmount(nextAmount);
    generate(nextAmount);
  }

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  }

  function download() {
    const blob = new Blob([`${uuids.join("\n")}\n`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "uuids.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/20">
      <div className="flex flex-wrap items-end gap-5 border-b border-white/10 p-5">
        <label className="grid gap-2 text-xs font-medium text-slate-400">
          {t.amount}
          <select value={amount} onChange={(event) => changeAmount(Number(event.target.value))} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none">
            {[1, 5, 10, 25, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm text-slate-300">
          <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} className="accent-emerald-400" />
          {t.uppercase}
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm text-slate-300">
          <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)} className="accent-emerald-400" />
          {t.hyphens}
        </label>
        <button onClick={() => generate()} className="ml-auto rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">{t.generate}</button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <div><p className="text-sm font-semibold">{t.result}</p><p className="mt-1 text-xs text-slate-500">{t.local}</p></div>
        <div className="flex gap-2">
          <button onClick={() => copy(uuids.join("\n"), "all")} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-emerald-400/30">{copied === "all" ? t.copied : t.copyAll}</button>
          <button onClick={download} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-emerald-400/30">{t.download}</button>
        </div>
      </div>
      <ol className="max-h-[34rem] divide-y divide-white/5 overflow-auto">
        {uuids.map((uuid, index) => {
          const key = `${uuid}-${index}`;
          return (
            <li key={key} className="group flex items-center gap-3 px-5 py-3 hover:bg-white/[0.025]">
              <span className="w-7 shrink-0 text-right font-mono text-xs text-slate-600">{index + 1}</span>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-200">{uuid}</code>
              <button onClick={() => copy(uuid, key)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 opacity-70 transition hover:text-emerald-300 group-hover:opacity-100">{copied === key ? t.copied : t.copy}</button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
