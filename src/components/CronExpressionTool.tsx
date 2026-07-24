"use client";

import { useMemo, useState } from "react";

const fields = [
  { key: "minute", label: "Minute", range: "0–59", min: 0, max: 59 },
  { key: "hour", label: "Hour", range: "0–23", min: 0, max: 23 },
  { key: "day", label: "Day", range: "1–31", min: 1, max: 31 },
  { key: "month", label: "Month", range: "1–12", min: 1, max: 12 },
  { key: "weekday", label: "Weekday", range: "0–7", min: 0, max: 7 },
] as const;

const presets = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Weekdays at 9 AM", value: "0 9 * * 1-5" },
  { label: "Sunday at midnight", value: "0 0 * * 0" },
  { label: "First day monthly", value: "0 0 1 * *" },
];

const zones = [
  { label: "Local time", value: "local" },
  { label: "UTC", value: "UTC" },
  { label: "Shanghai", value: "Asia/Shanghai" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "London", value: "Europe/London" },
  { label: "New York", value: "America/New_York" },
];

type CronField = (typeof fields)[number];

function parsePart(value: string, field: CronField) {
  const allowed = new Set<number>();
  const normalized = value.trim();
  if (!normalized) return null;

  for (const section of normalized.split(",")) {
    const [base, stepText] = section.split("/");
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) return null;

    let start: number;
    let end: number;
    if (base === "*") {
      start = field.min;
      end = field.max;
    } else if (base.includes("-")) {
      const [startText, endText] = base.split("-");
      start = Number(startText);
      end = Number(endText);
    } else {
      start = Number(base);
      end = start;
    }

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < field.min ||
      end > field.max ||
      start > end
    ) {
      return null;
    }
    for (let item = start; item <= end; item += step) {
      allowed.add(field.key === "weekday" && item === 7 ? 0 : item);
    }
  }
  return allowed;
}

function parseCron(expression: string) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const parsed = fields.map((field, index) => parsePart(parts[index], field));
  if (parsed.some((item) => item === null)) return null;
  return {
    parts,
    minute: parsed[0]!,
    hour: parsed[1]!,
    day: parsed[2]!,
    month: parsed[3]!,
    weekday: parsed[4]!,
  };
}

function zonedParts(date: Date, zone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone === "local" ? undefined : zone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    weekday: "short",
  });
  const values = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const weekdays: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    minute: Number(values.minute),
    hour: Number(values.hour),
    day: Number(values.day),
    month: Number(values.month),
    weekday: weekdays[values.weekday],
  };
}

function getNextRuns(expression: string, zone: string) {
  const cron = parseCron(expression);
  if (!cron) return [];
  const results: Date[] = [];
  let time = Math.floor(Date.now() / 60_000) * 60_000 + 60_000;
  const maxIterations = 46_000;
  const dayRestricted = cron.parts[2] !== "*";
  const weekdayRestricted = cron.parts[4] !== "*";

  for (let index = 0; index < maxIterations && results.length < 6; index += 1) {
    const date = new Date(time);
    const parts = zonedParts(date, zone);
    const dayMatches = cron.day.has(parts.day);
    const weekdayMatches = cron.weekday.has(parts.weekday);
    const calendarMatches =
      dayRestricted && weekdayRestricted
        ? dayMatches || weekdayMatches
        : dayMatches && weekdayMatches;

    if (
      cron.minute.has(parts.minute) &&
      cron.hour.has(parts.hour) &&
      cron.month.has(parts.month) &&
      calendarMatches
    ) {
      results.push(date);
    }
    time += 60_000;
  }
  return results;
}

function explainPart(value: string, label: string) {
  if (value === "*") return `every ${label.toLowerCase()}`;
  if (value.startsWith("*/")) {
    return `every ${value.slice(2)} ${label.toLowerCase()}s`;
  }
  if (value.includes(",")) return `${label.toLowerCase()} ${value}`;
  if (value.includes("-")) return `${label.toLowerCase()} ${value.replace("-", " through ")}`;
  return `${label.toLowerCase()} ${value}`;
}

function explainCron(expression: string) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5 || !parseCron(expression)) return "Enter a valid five-part cron expression.";
  if (expression === "* * * * *") return "Runs every minute.";
  if (expression === "0 * * * *") return "Runs at the start of every hour.";
  if (expression === "0 0 * * *") return "Runs every day at midnight.";
  return `Runs at ${explainPart(parts[0], "Minute")}, ${explainPart(parts[1], "Hour")}; ${explainPart(parts[2], "Day")}, ${explainPart(parts[3], "Month")}, ${explainPart(parts[4], "Weekday")}.`;
}

function formatRun(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone === "local" ? undefined : zone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

export default function CronExpressionTool() {
  const [expression, setExpression] = useState("*/5 * * * *");
  const [zone, setZone] = useState("local");
  const [copied, setCopied] = useState(false);
  const parsed = useMemo(() => parseCron(expression), [expression]);
  const runs = useMemo(
    () => (parsed ? getNextRuns(expression, zone) : []),
    [expression, parsed, zone],
  );
  const parts = expression.trim().split(/\s+/);

  function updateField(index: number, value: string) {
    const next = Array.from({ length: 5 }, (_, partIndex) => parts[partIndex] ?? "*");
    next[index] = value || "*";
    setExpression(next.join(" "));
  }

  async function copyExpression() {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-violet-950/10">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Cron expression
              </p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  value={expression}
                  onChange={(event) => setExpression(event.target.value)}
                  spellCheck={false}
                  aria-label="Cron expression"
                  className={`min-w-0 flex-1 rounded-2xl border bg-slate-950 px-4 py-4 font-mono text-xl text-white outline-none transition sm:text-2xl ${
                    parsed ? "border-white/10 focus:border-emerald-400/50" : "border-rose-400/30 focus:border-rose-400/60"
                  }`}
                />
                <button
                  type="button"
                  onClick={copyExpression}
                  disabled={!parsed}
                  className="rounded-xl border border-white/10 px-4 py-4 text-sm text-slate-300 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div className={`flex shrink-0 items-center gap-2 text-sm ${parsed ? "text-emerald-300" : "text-rose-300"}`}>
              <span className={`h-2 w-2 rounded-full ${parsed ? "bg-emerald-400" : "bg-rose-400"}`} />
              {parsed ? "Valid expression" : "Invalid expression"}
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {explainCron(expression)}
          </p>
        </div>

        <div className="grid gap-px bg-white/10 sm:grid-cols-5">
          {fields.map((field, index) => (
            <label key={field.key} className="bg-slate-900 p-4">
              <span className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">{field.label}</span>
                <span className="text-slate-600">{field.range}</span>
              </span>
              <input
                value={parts[index] ?? ""}
                onChange={(event) => updateField(index, event.target.value)}
                spellCheck={false}
                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-center font-mono text-lg text-emerald-300 outline-none focus:border-emerald-400/50"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
        <h2 className="font-semibold">Common schedules</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setExpression(preset.value)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                expression === preset.value
                  ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <label htmlFor="cron-zone" className="text-sm font-medium text-slate-300">
            Schedule timezone
          </label>
          <select
            id="cron-zone"
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50"
          >
            {zones.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Preview times account for the selected timezone and daylight-saving changes.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Next run times</h2>
            <span className="text-xs text-slate-600">Up to 6 results</span>
          </div>
          {!parsed ? (
            <div className="mt-4 rounded-2xl border border-dashed border-rose-400/20 py-12 text-center text-sm text-rose-300">
              Fix the expression to preview run times.
            </div>
          ) : runs.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">
              No run found within the current preview window.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {runs.map((run, index) => (
                <div key={run.toISOString()} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-xs text-violet-300">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm text-slate-300">
                    {formatRun(run, zone)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
