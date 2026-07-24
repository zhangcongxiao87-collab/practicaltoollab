"use client";

import { useEffect, useMemo, useState } from "react";

type Unit = "auto" | "seconds" | "milliseconds";

const timeZones = [
  { label: "Local time", value: "local" },
  { label: "UTC", value: "UTC" },
  { label: "Shanghai", value: "Asia/Shanghai" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "Singapore", value: "Asia/Singapore" },
  { label: "London", value: "Europe/London" },
  { label: "New York", value: "America/New_York" },
  { label: "Los Angeles", value: "America/Los_Angeles" },
];

function parseTimestamp(value: string, unit: Unit) {
  const trimmed = value.trim();
  if (!trimmed || !/^-?\d+(\.\d+)?$/.test(trimmed)) return null;
  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) return null;
  const detectedUnit =
    unit === "auto"
      ? Math.abs(numeric) >= 100_000_000_000
        ? "milliseconds"
        : "seconds"
      : unit;
  const milliseconds =
    detectedUnit === "seconds" ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime())
    ? null
    : { date, detectedUnit, milliseconds };
}

function formatInZone(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: zone === "local" ? undefined : zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

function relativeTime(date: Date, now: number) {
  const seconds = Math.round((date.getTime() - now) / 1000);
  const absolute = Math.abs(seconds);
  if (absolute < 60) return `${absolute}s ${seconds < 0 ? "ago" : "from now"}`;
  const minutes = Math.round(absolute / 60);
  if (minutes < 60) return `${minutes}m ${seconds < 0 ? "ago" : "from now"}`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ${seconds < 0 ? "ago" : "from now"}`;
  const days = Math.round(hours / 24);
  return `${days}d ${seconds < 0 ? "ago" : "from now"}`;
}

export default function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now());
  const [timestamp, setTimestamp] = useState(() =>
    Math.floor(Date.now() / 1000).toString(),
  );
  const [unit, setUnit] = useState<Unit>("auto");
  const [zone, setZone] = useState("local");
  const [dateInput, setDateInput] = useState("");
  const [batch, setBatch] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const result = useMemo(
    () => parseTimestamp(timestamp, unit),
    [timestamp, unit],
  );
  const dateConversion = useMemo(() => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000).toString(),
      milliseconds: date.getTime().toString(),
    };
  }, [dateInput]);
  const batchResults = useMemo(
    () =>
      batch
        .split(/\r?\n/)
        .map((value) => ({
          value: value.trim(),
          parsed: parseTimestamp(value, unit),
        }))
        .filter((item) => item.value),
    [batch, unit],
  );

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-emerald-950/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Current Unix time</p>
            <span className="flex items-center gap-2 text-xs text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <button
            type="button"
            onClick={() => copy(Math.floor(now / 1000).toString(), "now")}
            className="mt-5 block max-w-full truncate font-mono text-3xl font-semibold tracking-tight text-white transition hover:text-emerald-300 sm:text-4xl"
            title="Copy current timestamp"
          >
            {Math.floor(now / 1000)}
          </button>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span>Seconds</span>
            <span>{formatInZone(new Date(now), zone)}</span>
            <span className="text-emerald-400">
              {copied === "now" ? "Copied!" : "Click to copy"}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <label htmlFor="timezone" className="text-sm font-medium text-slate-400">
            Display timezone
          </label>
          <select
            id="timezone"
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/50"
          >
            {timeZones.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            The original moment stays the same. Only its displayed timezone changes.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">Timestamp to date</h2>
          <p className="mt-1 text-sm text-slate-500">
            Seconds and milliseconds are detected automatically.
          </p>
        </div>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <label htmlFor="timestamp" className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Unix timestamp
            </label>
            <input
              id="timestamp"
              value={timestamp}
              onChange={(event) => setTimestamp(event.target.value)}
              inputMode="numeric"
              spellCheck={false}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 font-mono text-xl text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400/50"
              placeholder="e.g. 1735689600"
            />
            <div className="mt-4 flex rounded-xl bg-slate-950 p-1">
              {(["auto", "seconds", "milliseconds"] as Unit[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setUnit(option)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs capitalize transition ${
                    unit === option
                      ? "bg-white/10 text-white"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  {option === "milliseconds" ? "Millis" : option}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setTimestamp(Math.floor(Date.now() / 1000).toString())
              }
              className="mt-4 text-xs text-emerald-400 hover:text-emerald-300"
            >
              Use current time
            </button>
          </div>

          <div className="p-5">
            {!result ? (
              <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-600">
                Enter a valid Unix timestamp
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  ["Selected timezone", formatInZone(result.date, zone)],
                  ["UTC", result.date.toUTCString()],
                  ["ISO 8601", result.date.toISOString()],
                  ["Relative", relativeTime(result.date, now)],
                ].map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => copy(value, label)}
                    className="group flex w-full items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <span className="shrink-0 text-xs text-slate-500">{label}</span>
                    <span className="min-w-0 truncate font-mono text-sm text-slate-200 group-hover:text-emerald-300">
                      {copied === label ? "Copied!" : value}
                    </span>
                  </button>
                ))}
                <div className="px-4 pt-2 text-xs text-slate-600">
                  Detected as {result.detectedUnit}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <h2 className="font-semibold">Date to timestamp</h2>
          <p className="mt-1 text-sm text-slate-500">
            The entered date is interpreted in your browser&apos;s local timezone.
          </p>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(event) => setDateInput(event.target.value)}
            className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
          />
          {dateConversion && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                ["Seconds", dateConversion.seconds],
                ["Milliseconds", dateConversion.milliseconds],
              ].map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => copy(value, `date-${label}`)}
                  className="rounded-xl border border-white/10 bg-slate-950 p-3 text-left transition hover:border-emerald-400/30"
                >
                  <span className="block text-xs text-slate-500">{label}</span>
                  <span className="mt-1 block truncate font-mono text-sm text-slate-200">
                    {copied === `date-${label}` ? "Copied!" : value}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <h2 className="font-semibold">Batch convert</h2>
          <p className="mt-1 text-sm text-slate-500">Paste one timestamp per line.</p>
          <textarea
            value={batch}
            onChange={(event) => setBatch(event.target.value)}
            spellCheck={false}
            className="mt-5 h-28 w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-700 focus:border-emerald-400/50"
            placeholder={"1735689600\n1735776000000"}
          />
          {batchResults.length > 0 && (
            <div className="mt-3 max-h-44 space-y-1 overflow-auto">
              {batchResults.map((item, index) => (
                <div
                  key={`${item.value}-${index}`}
                  className="grid grid-cols-[0.8fr_1.2fr] gap-3 rounded-lg px-3 py-2 text-xs hover:bg-white/[0.03]"
                >
                  <span className="truncate font-mono text-slate-500">
                    {item.value}
                  </span>
                  <span
                    className={
                      item.parsed ? "truncate text-slate-300" : "text-rose-300"
                    }
                  >
                    {item.parsed
                      ? formatInZone(item.parsed.date, zone)
                      : "Invalid timestamp"}
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
