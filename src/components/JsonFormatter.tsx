"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";

const SAMPLE = `{
  "project": "Practical Tool Lab",
  "active": true,
  "tools": ["JSON Formatter", "Timestamp Converter"],
  "owner": {
    "name": "Xiao & Mei",
    "location": "Shanghai"
  }
}`;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type ParseResult =
  | { ok: true; value: JsonValue }
  | { ok: false; message: string; line?: number; column?: number };

function parseJson(input: string): ParseResult {
  if (!input.trim()) return { ok: false, message: "Paste JSON to begin." };

  try {
    return { ok: true, value: JSON.parse(input) as JsonValue };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    const positionMatch = message.match(/position\s+(\d+)/i);
    const lineColumnMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    if (lineColumnMatch) {
      return {
        ok: false,
        message,
        line: Number(lineColumnMatch[1]),
        column: Number(lineColumnMatch[2]),
      };
    }
    if (positionMatch) {
      const position = Number(positionMatch[1]);
      const lines = input.slice(0, position).split("\n");
      return {
        ok: false,
        message,
        line: lines.length,
        column: (lines.at(-1)?.length ?? 0) + 1,
      };
    }
    return { ok: false, message };
  }
}

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJson);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, JsonValue>>((result, key) => {
        result[key] = sortJson(value[key]);
        return result;
      }, {});
  }
  return value;
}

function getStats(value: JsonValue) {
  let keys = 0;
  let values = 0;
  let maxDepth = 0;
  function walk(item: JsonValue, depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    if (Array.isArray(item)) {
      item.forEach((child) => walk(child, depth + 1));
    } else if (item && typeof item === "object") {
      Object.entries(item).forEach(([, child]) => {
        keys += 1;
        walk(child, depth + 1);
      });
    } else {
      values += 1;
    }
  }
  walk(value, 0);
  return { keys, values, depth: maxDepth };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
}

function TreeNode({
  name,
  value,
  depth = 0,
}: {
  name?: string;
  value: JsonValue;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isContainer = value !== null && typeof value === "object";
  const entries = isContainer
    ? Array.isArray(value)
      ? value.map((item, index) => [String(index), item] as const)
      : Object.entries(value)
    : [];
  const valueColor =
    typeof value === "string"
      ? "text-emerald-300"
      : typeof value === "number"
        ? "text-sky-300"
        : typeof value === "boolean"
          ? "text-amber-300"
          : "text-slate-400";

  if (!isContainer) {
    return (
      <div className="font-mono text-sm leading-7">
        {name !== undefined && <span className="text-violet-300">{name}: </span>}
        <span className={valueColor}>
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-7 items-center gap-2 text-left"
      >
        <span className="w-3 text-slate-500">{open ? "⌄" : "›"}</span>
        {name !== undefined && <span className="text-violet-300">{name}</span>}
        <span className="text-xs text-slate-500">
          {Array.isArray(value) ? `Array(${value.length})` : `Object(${entries.length})`}
        </span>
      </button>
      {open && (
        <div className="ml-2 border-l border-white/10 pl-4">
          {entries.map(([key, child]) => (
            <TreeNode key={key} name={key} value={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JsonFormatter({ locale = "en" }: { locale?: "en" | "zh" }) {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState(
    JSON.stringify(JSON.parse(SAMPLE), null, 2),
  );
  const [indent, setIndent] = useState<2 | 4>(2);
  const [view, setView] = useState<"code" | "tree">("code");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const parsed = useMemo(() => parseJson(input), [input]);
  const stats = useMemo(() => (parsed.ok ? getStats(parsed.value) : null), [parsed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        const result = parseJson(input);
        if (result.ok) setOutput(JSON.stringify(result.value, null, indent));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [indent, input]);

  function format() {
    if (parsed.ok) setOutput(JSON.stringify(parsed.value, null, indent));
  }
  function minify() {
    if (parsed.ok) setOutput(JSON.stringify(parsed.value));
  }
  function sortKeys() {
    if (parsed.ok) setOutput(JSON.stringify(sortJson(parsed.value), null, indent));
  }
  function updateInput(value: string) {
    setInput(value);
    const result = parseJson(value);
    if (result.ok) setOutput(JSON.stringify(result.value, null, indent));
  }
  function updateIndent(spaces: 2 | 4) {
    setIndent(spaces);
    if (parsed.ok) setOutput(JSON.stringify(parsed.value, null, spaces));
  }
  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  function downloadOutput() {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  function openInWorkbench() {
    if (!output) return;
    window.localStorage.setItem("ptl-workbench-input", output);
    window.location.href = locale === "zh" ? "/zh/workbench" : "/workbench";
  }
  function readFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateInput(String(reader.result ?? ""));
    reader.readAsText(file);
  }
  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    readFile(event.target.files?.[0]);
    event.target.value = "";
  }
  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    readFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/20 backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={format} disabled={!parsed.ok} className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">
            Format
          </button>
          <button type="button" onClick={minify} disabled={!parsed.ok} className="tool-button">Minify</button>
          <button type="button" onClick={sortKeys} disabled={!parsed.ok} className="tool-button">Sort keys</button>
          <label className="tool-button cursor-pointer">
            Open file
            <input type="file" accept=".json,application/json,text/plain" onChange={onFileChange} className="sr-only" />
          </label>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Indent</span>
          <div className="flex rounded-lg bg-slate-950 p-1">
            {[2, 4].map((spaces) => (
              <button key={spaces} type="button" onClick={() => updateIndent(spaces as 2 | 4)} className={`rounded-md px-2.5 py-1 transition ${indent === spaces ? "bg-white/10 text-white" : "hover:text-white"}`}>
                {spaces}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline">Ctrl/⌘ + Enter</span>
        </div>
      </div>

      <div className="grid min-h-[560px] lg:grid-cols-2">
        <div
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative border-b border-white/10 lg:border-b-0 lg:border-r ${isDragging ? "bg-emerald-400/10" : ""}`}
        >
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Input</span>
              <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-500">JSON</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => updateInput(SAMPLE)} className="text-xs text-slate-400 transition hover:text-white">Sample</button>
              <button type="button" onClick={() => { setInput(""); setOutput(""); }} className="text-xs text-slate-400 transition hover:text-white">Clear</button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(event) => updateInput(event.target.value)}
            spellCheck={false}
            aria-label="JSON input"
            className="h-[440px] w-full resize-none bg-transparent p-5 font-mono text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700 lg:h-[508px]"
            placeholder="Paste JSON here, or drop a .json file…"
          />
          {isDragging && (
            <div className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-slate-950/90 text-sm font-medium text-emerald-300">
              Drop your JSON file here
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <div className="flex rounded-lg bg-slate-950 p-1">
              {(["code", "tree"] as const).map((option) => (
                <button key={option} type="button" onClick={() => setView(option)} className={`rounded-md px-3 py-1 text-xs capitalize transition ${view === option ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
                  {option}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={openInWorkbench} disabled={!output} className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300 disabled:opacity-40">
                {locale === "zh" ? "发送到工作台" : "Open in Workbench"}
              </button>
              <button type="button" onClick={downloadOutput} disabled={!output} className="text-xs text-slate-400 transition hover:text-white disabled:opacity-40">Download</button>
              <button type="button" onClick={copyOutput} disabled={!output} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/20 hover:text-white disabled:opacity-40">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="h-[440px] overflow-auto p-5 lg:h-[508px]">
            {!parsed.ok ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-300">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  JSON needs attention
                </div>
                <p className="break-words font-mono text-xs leading-6 text-rose-200/70">{parsed.message}</p>
                {parsed.line && <p className="mt-3 text-xs text-slate-400">Line {parsed.line}{parsed.column ? `, column ${parsed.column}` : ""}</p>}
              </div>
            ) : view === "tree" ? (
              <TreeNode value={parsed.value} />
            ) : (
              <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-200">{output}</pre>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className={`flex items-center gap-2 ${parsed.ok ? "text-emerald-300" : "text-slate-500"}`}>
          <span className={`h-2 w-2 rounded-full ${parsed.ok ? "bg-emerald-400" : "bg-slate-600"}`} />
          {parsed.ok ? "Valid JSON" : "Waiting for valid JSON"}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-slate-500">
          <span>{formatBytes(new TextEncoder().encode(input).length)}</span>
          {stats && <><span>{stats.keys} keys</span><span>{stats.values} values</span><span>Depth {stats.depth}</span></>}
          <span className="text-slate-400">Processed locally</span>
        </div>
      </div>
    </div>
  );
}
