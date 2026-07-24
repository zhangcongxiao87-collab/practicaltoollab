"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Primitive = string | number | boolean | null;
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };
type Row = Record<string, Primitive>;

const SAMPLE = `[
  {
    "id": 101,
    "name": "Ada",
    "active": true,
    "profile": { "city": "London", "role": "Engineer" },
    "skills": ["JSON", "APIs"]
  },
  {
    "id": 102,
    "name": "Lin",
    "active": false,
    "profile": { "city": "Shanghai", "role": "Analyst" },
    "skills": ["SQL", "CSV"]
  }
]`;

const copy = {
  en: {
    convert: "Convert to CSV",
    sample: "Load sample",
    open: "Open JSON",
    clear: "Clear",
    input: "JSON input",
    output: "CSV preview",
    placeholder: "Paste a JSON array of objects here…",
    delimiter: "Delimiter",
    comma: "Comma",
    semicolon: "Semicolon",
    tab: "Tab",
    flatten: "Flatten nested objects",
    copy: "Copy CSV",
    copied: "Copied!",
    download: "Download .csv",
    valid: "Ready to convert",
    waiting: "Waiting for JSON",
    error: "JSON needs attention",
    rows: "rows",
    columns: "columns",
    local: "Processed locally",
    empty: "Your CSV preview will appear here.",
    arrayError: "Use a JSON array of objects, or a single JSON object.",
  },
  zh: {
    convert: "转换为 CSV",
    sample: "载入示例",
    open: "打开 JSON",
    clear: "清空",
    input: "JSON 输入",
    output: "CSV 预览",
    placeholder: "在这里粘贴 JSON 对象数组…",
    delimiter: "分隔符",
    comma: "逗号",
    semicolon: "分号",
    tab: "制表符",
    flatten: "展开嵌套对象",
    copy: "复制 CSV",
    copied: "已复制",
    download: "下载 .csv",
    valid: "可以转换",
    waiting: "等待输入 JSON",
    error: "JSON 需要修正",
    rows: "行",
    columns: "列",
    local: "仅在本地处理",
    empty: "CSV 预览将显示在这里。",
    arrayError: "请输入 JSON 对象数组，或单个 JSON 对象。",
  },
} as const;

function flattenObject(
  value: Record<string, JsonValue>,
  shouldFlatten: boolean,
  prefix = "",
): Row {
  const result: Row = {};
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      shouldFlatten &&
      child !== null &&
      typeof child === "object" &&
      !Array.isArray(child)
    ) {
      Object.assign(
        result,
        flattenObject(child as Record<string, JsonValue>, true, path),
      );
    } else if (Array.isArray(child) || (child && typeof child === "object")) {
      result[path] = JSON.stringify(child);
    } else {
      result[path] = child as Primitive;
    }
  }
  return result;
}

function quoteCell(value: Primitive | undefined, delimiter: string) {
  if (value === undefined || value === null) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(delimiter) ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function parseRows(input: string, flatten: boolean) {
  if (!input.trim()) return { state: "empty" as const };
  try {
    const parsed = JSON.parse(input) as JsonValue;
    const values = Array.isArray(parsed) ? parsed : [parsed];
    if (
      values.some(
        (value) => value === null || typeof value !== "object" || Array.isArray(value),
      )
    ) {
      return { state: "shape-error" as const };
    }
    const rows = values.map((value) =>
      flattenObject(value as Record<string, JsonValue>, flatten),
    );
    const headers = Array.from(
      new Set(rows.flatMap((row) => Object.keys(row))),
    );
    return { state: "valid" as const, rows, headers };
  } catch (error) {
    return {
      state: "invalid" as const,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

function makeCsv(rows: Row[], headers: string[], delimiter: string) {
  return [
    headers.map((header) => quoteCell(header, delimiter)).join(delimiter),
    ...rows.map((row) =>
      headers.map((header) => quoteCell(row[header], delimiter)).join(delimiter),
    ),
  ].join("\r\n");
}

export default function JsonToCsv({
  locale = "en",
}: {
  locale?: "en" | "zh";
}) {
  const t = copy[locale];
  const [input, setInput] = useState(SAMPLE);
  const [delimiter, setDelimiter] = useState(",");
  const [flatten, setFlatten] = useState(true);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => parseRows(input, flatten), [input, flatten]);
  const csv = useMemo(
    () =>
      result.state === "valid"
        ? makeCsv(result.rows, result.headers, delimiter)
        : "",
    [delimiter, result],
  );

  async function copyCsv() {
    if (!csv) return;
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function download() {
    if (!csv) return;
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setInput(String(reader.result ?? ""));
      reader.readAsText(file);
    }
    event.target.value = "";
  }

  const status =
    result.state === "valid"
      ? t.valid
      : result.state === "empty"
        ? t.waiting
        : t.error;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/20 backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!csv}
            onClick={() =>
              document
                .getElementById("csv-preview")
                ?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-40"
          >
            {t.convert}
          </button>
          <button type="button" className="tool-button" onClick={() => setInput(SAMPLE)}>
            {t.sample}
          </button>
          <label className="tool-button cursor-pointer">
            {t.open}
            <input
              type="file"
              accept=".json,application/json,text/plain"
              onChange={openFile}
              className="sr-only"
            />
          </label>
          <button type="button" className="tool-button" onClick={() => setInput("")}>
            {t.clear}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>{t.delimiter}</span>
          <select
            value={delimiter}
            onChange={(event) => setDelimiter(event.target.value)}
            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-300 outline-none"
          >
            <option value=",">{t.comma} (,)</option>
            <option value=";">{t.semicolon} (;)</option>
            <option value={"\t"}>{t.tab}</option>
          </select>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={flatten}
              onChange={(event) => setFlatten(event.target.checked)}
              className="accent-emerald-400"
            />
            {t.flatten}
          </label>
        </div>
      </div>

      <div className="grid min-h-[530px] lg:grid-cols-2">
        <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-medium">{t.input}</span>
            <span
              className={`flex items-center gap-2 text-xs ${
                result.state === "valid"
                  ? "text-emerald-300"
                  : result.state === "empty"
                    ? "text-slate-500"
                    : "text-rose-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  result.state === "valid"
                    ? "bg-emerald-400"
                    : result.state === "empty"
                      ? "bg-slate-600"
                      : "bg-rose-400"
                }`}
              />
              {status}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-label={t.input}
            placeholder={t.placeholder}
            className="h-[478px] w-full resize-none bg-transparent p-5 font-mono text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700"
          />
        </section>

        <section id="csv-preview" className="min-w-0 scroll-mt-4">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-medium">{t.output}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!csv}
                onClick={download}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-40"
              >
                {t.download}
              </button>
              <button
                type="button"
                disabled={!csv}
                onClick={copyCsv}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-40"
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </div>
          <div className="h-[478px] overflow-auto p-5">
            {result.state === "valid" ? (
              <table className="min-w-full border-separate border-spacing-0 font-mono text-xs">
                <thead>
                  <tr>
                    {result.headers.map((header) => (
                      <th
                        key={header}
                        className="sticky top-0 whitespace-nowrap border-b border-white/10 bg-slate-900 px-3 py-2 text-left font-medium text-emerald-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={index} className="hover:bg-white/[0.03]">
                      {result.headers.map((header) => (
                        <td
                          key={header}
                          className="max-w-64 border-b border-white/5 px-3 py-2 text-slate-300"
                        >
                          <span className="block truncate" title={String(row[header] ?? "")}>
                            {String(row[header] ?? "")}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                className={`rounded-2xl border p-5 text-sm ${
                  result.state === "empty"
                    ? "border-white/10 text-slate-500"
                    : "border-rose-400/20 bg-rose-400/5 text-rose-300"
                }`}
              >
                {result.state === "empty"
                  ? t.empty
                  : result.state === "shape-error"
                    ? t.arrayError
                    : result.error}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-slate-500">
        <span>{t.local}</span>
        {result.state === "valid" && (
          <span>
            {result.rows.length} {t.rows} · {result.headers.length} {t.columns}
          </span>
        )}
      </div>
    </div>
  );
}
