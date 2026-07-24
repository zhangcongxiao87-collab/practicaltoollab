"use client";

import { ChangeEvent, useMemo, useState } from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type DiffType = "added" | "removed" | "changed";

type Difference = {
  path: string;
  type: DiffType;
  before?: JsonValue;
  after?: JsonValue;
};

type CopyTarget = "path" | "report" | null;

const LEFT_SAMPLE = `{
  "name": "Practical Tool Lab",
  "version": 1,
  "features": ["format", "validate"],
  "settings": {
    "theme": "dark",
    "private": true
  }
}`;

const RIGHT_SAMPLE = `{
  "name": "Practical Tool Lab",
  "version": 2,
  "features": ["format", "validate", "compare"],
  "settings": {
    "theme": "system",
    "private": true
  },
  "status": "active"
}`;

const text = {
  en: {
    compare: "Compare",
    swap: "Swap",
    sample: "Load sample",
    clear: "Clear",
    open: "Open file",
    original: "Original JSON",
    modified: "Modified JSON",
    originalPlaceholder: "Paste the original JSON here…",
    modifiedPlaceholder: "Paste the modified JSON here…",
    valid: "Valid JSON",
    empty: "Waiting for JSON",
    invalid: "Invalid JSON",
    differences: "Differences",
    identical: "These JSON documents are identical.",
    ready: "Add valid JSON on both sides to compare.",
    search: "Search paths or values…",
    all: "All",
    added: "Added",
    removed: "Removed",
    changed: "Changed",
    before: "Before",
    after: "After",
    path: "Path",
    copyPath: "Copy path",
    copied: "Copied",
    copyReport: "Copy report",
    download: "Download report",
    showing: "Showing",
    of: "of",
    local: "Compared locally in your browser",
    noMatches: "No differences match this filter.",
  },
  zh: {
    compare: "开始对比",
    swap: "交换",
    sample: "载入示例",
    clear: "清空",
    open: "打开文件",
    original: "原始 JSON",
    modified: "修改后 JSON",
    originalPlaceholder: "在这里粘贴原始 JSON…",
    modifiedPlaceholder: "在这里粘贴修改后的 JSON…",
    valid: "JSON 有效",
    empty: "等待输入 JSON",
    invalid: "JSON 无效",
    differences: "差异结果",
    identical: "两份 JSON 完全相同。",
    ready: "请在左右两侧输入有效 JSON。",
    search: "搜索路径或值…",
    all: "全部",
    added: "新增",
    removed: "删除",
    changed: "修改",
    before: "修改前",
    after: "修改后",
    path: "路径",
    copyPath: "复制路径",
    copied: "已复制",
    copyReport: "复制报告",
    download: "下载报告",
    showing: "显示",
    of: "/",
    local: "全部对比均在浏览器本地完成",
    noMatches: "没有符合筛选条件的差异。",
  },
} as const;

function parseJson(input: string) {
  if (!input.trim()) return { state: "empty" as const };
  try {
    return { state: "valid" as const, value: JSON.parse(input) as JsonValue };
  } catch (error) {
    return {
      state: "invalid" as const,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

function isObject(value: JsonValue): value is Record<string, JsonValue> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function childPath(parent: string, key: string, array = false) {
  if (array) return `${parent}[${key}]`;
  if (/^[A-Za-z_$][\w$]*$/.test(key)) return parent ? `${parent}.${key}` : key;
  return `${parent}["${key.replaceAll('"', '\\"')}"]`;
}

function findDifferences(
  before: JsonValue,
  after: JsonValue,
  path = "$",
): Difference[] {
  if (Object.is(before, after)) return [];

  if (Array.isArray(before) && Array.isArray(after)) {
    const result: Difference[] = [];
    const length = Math.max(before.length, after.length);
    for (let index = 0; index < length; index += 1) {
      const itemPath = childPath(path, String(index), true);
      if (index >= before.length) {
        result.push({ path: itemPath, type: "added", after: after[index] });
      } else if (index >= after.length) {
        result.push({ path: itemPath, type: "removed", before: before[index] });
      } else {
        result.push(...findDifferences(before[index], after[index], itemPath));
      }
    }
    return result;
  }

  if (isObject(before) && isObject(after)) {
    const result: Difference[] = [];
    const keys = Array.from(
      new Set([...Object.keys(before), ...Object.keys(after)]),
    ).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
      const itemPath = childPath(path, key);
      if (!(key in before)) {
        result.push({ path: itemPath, type: "added", after: after[key] });
      } else if (!(key in after)) {
        result.push({ path: itemPath, type: "removed", before: before[key] });
      } else {
        result.push(...findDifferences(before[key], after[key], itemPath));
      }
    }
    return result;
  }

  return [{ path, type: "changed", before, after }];
}

function displayValue(value: JsonValue | undefined) {
  if (value === undefined) return "—";
  return typeof value === "string" ? `"${value}"` : JSON.stringify(value);
}

function buildReport(differences: Difference[]) {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        total: differences.length,
        added: differences.filter((item) => item.type === "added").length,
        removed: differences.filter((item) => item.type === "removed").length,
        changed: differences.filter((item) => item.type === "changed").length,
      },
      differences,
    },
    null,
    2,
  );
}

function Status({
  result,
  locale,
}: {
  result: ReturnType<typeof parseJson>;
  locale: "en" | "zh";
}) {
  const t = text[locale];
  const label =
    result.state === "valid"
      ? t.valid
      : result.state === "invalid"
        ? t.invalid
        : t.empty;
  return (
    <span
      className={`flex items-center gap-2 text-xs ${
        result.state === "valid"
          ? "text-emerald-300"
          : result.state === "invalid"
            ? "text-rose-300"
            : "text-slate-500"
      }`}
      title={result.state === "invalid" ? result.error : undefined}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          result.state === "valid"
            ? "bg-emerald-400"
            : result.state === "invalid"
              ? "bg-rose-400"
              : "bg-slate-600"
        }`}
      />
      {label}
    </span>
  );
}

export default function JsonDiff({ locale = "en" }: { locale?: "en" | "zh" }) {
  const t = text[locale];
  const [left, setLeft] = useState(LEFT_SAMPLE);
  const [right, setRight] = useState(RIGHT_SAMPLE);
  const [filter, setFilter] = useState<"all" | DiffType>("all");
  const [query, setQuery] = useState("");
  const [copyTarget, setCopyTarget] = useState<CopyTarget>(null);

  const leftResult = useMemo(() => parseJson(left), [left]);
  const rightResult = useMemo(() => parseJson(right), [right]);
  const differences = useMemo(
    () =>
      leftResult.state === "valid" && rightResult.state === "valid"
        ? findDifferences(leftResult.value, rightResult.value)
        : null,
    [leftResult, rightResult],
  );
  const counts = useMemo(
    () => ({
      added: differences?.filter((item) => item.type === "added").length ?? 0,
      removed: differences?.filter((item) => item.type === "removed").length ?? 0,
      changed: differences?.filter((item) => item.type === "changed").length ?? 0,
    }),
    [differences],
  );
  const visible = useMemo(() => {
    if (!differences) return [];
    const needle = query.trim().toLowerCase();
    return differences.filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
      if (!needle) return true;
      return `${item.path} ${displayValue(item.before)} ${displayValue(item.after)}`
        .toLowerCase()
        .includes(needle);
    });
  }, [differences, filter, query]);

  function loadFile(side: "left" | "right", file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      if (side === "left") setLeft(value);
      else setRight(value);
    };
    reader.readAsText(file);
  }

  function onFileChange(
    side: "left" | "right",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    loadFile(side, event.target.files?.[0]);
    event.target.value = "";
  }

  async function copy(value: string, target: CopyTarget) {
    await navigator.clipboard.writeText(value);
    setCopyTarget(target);
    window.setTimeout(() => setCopyTarget(null), 1400);
  }

  function downloadReport() {
    if (!differences) return;
    const url = URL.createObjectURL(
      new Blob([buildReport(differences)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "json-diff-report.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const filters: Array<["all" | DiffType, string, number]> = [
    ["all", t.all, differences?.length ?? 0],
    ["added", t.added, counts.added],
    ["removed", t.removed, counts.removed],
    ["changed", t.changed, counts.changed],
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/20 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!differences}
            onClick={() =>
              document
                .getElementById("json-diff-results")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.compare}
          </button>
          <button
            type="button"
            className="tool-button"
            onClick={() => {
              setLeft(right);
              setRight(left);
            }}
          >
            ⇄ {t.swap}
          </button>
          <button
            type="button"
            className="tool-button"
            onClick={() => {
              setLeft(LEFT_SAMPLE);
              setRight(RIGHT_SAMPLE);
            }}
          >
            {t.sample}
          </button>
          <button
            type="button"
            className="tool-button"
            onClick={() => {
              setLeft("");
              setRight("");
            }}
          >
            {t.clear}
          </button>
        </div>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.local}
        </span>
      </div>

      <div className="grid lg:grid-cols-2">
        {(
          [
            ["left", t.original, left, setLeft, leftResult],
            ["right", t.modified, right, setRight, rightResult],
          ] as const
        ).map(([side, title, value, setValue, result]) => (
          <div
            key={side}
            className="border-b border-white/10 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{title}</span>
                <Status result={result} locale={locale} />
              </div>
              <label className="cursor-pointer text-xs text-slate-400 transition hover:text-white">
                {t.open}
                <input
                  type="file"
                  accept=".json,application/json,text/plain"
                  className="sr-only"
                  onChange={(event) => onFileChange(side, event)}
                />
              </label>
            </div>
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              spellCheck={false}
              aria-label={title}
              placeholder={
                side === "left" ? t.originalPlaceholder : t.modifiedPlaceholder
              }
              className="h-[360px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700"
            />
            {result.state === "invalid" && (
              <p className="border-t border-rose-400/10 bg-rose-400/5 px-4 py-2 font-mono text-xs text-rose-300">
                {result.error}
              </p>
            )}
          </div>
        ))}
      </div>

      <section id="json-diff-results" className="scroll-mt-4 border-t border-white/10">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-2 text-sm font-semibold">{t.differences}</h2>
            {filters.map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  filter === value
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              className="min-w-64 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40"
            />
            <button
              type="button"
              disabled={!differences}
              onClick={() =>
                differences && copy(buildReport(differences), "report")
              }
              className="tool-button"
            >
              {copyTarget === "report" ? t.copied : t.copyReport}
            </button>
            <button
              type="button"
              disabled={!differences}
              onClick={downloadReport}
              className="tool-button"
            >
              {t.download}
            </button>
          </div>
        </div>

        <div className="min-h-64">
          {differences === null ? (
            <div className="flex min-h-64 items-center justify-center p-8 text-center text-sm text-slate-500">
              {t.ready}
            </div>
          ) : differences.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-xl text-emerald-300">
                ✓
              </span>
              <p className="text-sm text-emerald-300">{t.identical}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center p-8 text-sm text-slate-500">
              {t.noMatches}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {visible.map((item) => (
                <article
                  key={`${item.type}-${item.path}`}
                  className="grid gap-3 px-4 py-4 transition hover:bg-white/[0.02] lg:grid-cols-[minmax(180px,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
                >
                  <div className="min-w-0">
                    <span
                      className={`mb-2 inline-flex rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        item.type === "added"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : item.type === "removed"
                            ? "bg-rose-400/10 text-rose-300"
                            : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {t[item.type]}
                    </span>
                    <button
                      type="button"
                      title={t.copyPath}
                      onClick={() => copy(item.path, "path")}
                      className="block max-w-full truncate font-mono text-xs text-slate-300 hover:text-white"
                    >
                      {item.path}
                    </button>
                  </div>
                  <div className="min-w-0 rounded-xl border border-rose-400/10 bg-rose-400/[0.04] p-3">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-600">
                      {t.before}
                    </p>
                    <pre className="overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-300">
                      {displayValue(item.before)}
                    </pre>
                  </div>
                  <div className="min-w-0 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-600">
                      {t.after}
                    </p>
                    <pre className="overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-300">
                      {displayValue(item.after)}
                    </pre>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {differences && differences.length > 0 && (
          <div className="border-t border-white/10 px-4 py-3 text-xs text-slate-500">
            {t.showing} {visible.length} {t.of} {differences.length}
            {copyTarget === "path" && (
              <span className="ml-3 text-emerald-300">{t.copied}</span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
