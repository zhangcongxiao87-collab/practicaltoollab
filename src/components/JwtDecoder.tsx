"use client";

import { useMemo, useState } from "react";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsInJvbGUiOiJkZXZlbG9wZXIiLCJpYXQiOjE3NTM0MDgwMDAsImV4cCI6MTc4NDk0NDAwMH0.demo-signature";

const copy = {
  en: {
    sample: "Load sample",
    clear: "Clear",
    token: "Encoded JWT",
    placeholder: "Paste a JWT here…",
    decoded: "Decoded token",
    header: "Header",
    payload: "Payload",
    signature: "Signature",
    copy: "Copy",
    copied: "Copied!",
    download: "Download payload",
    valid: "Token decoded",
    invalid: "Unable to decode token",
    waiting: "Paste a token to begin.",
    notVerified: "Signature not verified",
    warning:
      "This tool only decodes the token. A readable JWT is not proof that its signature or claims are trustworthy.",
    issued: "Issued",
    expires: "Expires",
    notBefore: "Valid from",
    expired: "Expired",
    active: "Not expired",
    noExpiry: "No expiration claim",
    local: "Decoded locally in your browser",
  },
  zh: {
    sample: "载入示例",
    clear: "清空",
    token: "已编码 JWT",
    placeholder: "在这里粘贴 JWT…",
    decoded: "解码结果",
    header: "头部 Header",
    payload: "载荷 Payload",
    signature: "签名 Signature",
    copy: "复制",
    copied: "已复制",
    download: "下载 Payload",
    valid: "解码成功",
    invalid: "无法解码此 Token",
    waiting: "粘贴 Token 后开始。",
    notVerified: "签名未经验证",
    warning: "本工具只负责解码。JWT 可以被读取，并不代表其签名或声明可信。",
    issued: "签发时间",
    expires: "过期时间",
    notBefore: "生效时间",
    expired: "已过期",
    active: "尚未过期",
    noExpiry: "没有过期时间",
    local: "仅在浏览器本地解码",
  },
} as const;

type JwtObject = Record<string, unknown>;

function decodePart(part: string): JwtObject {
  const normalized = part.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const decoded = new TextDecoder().decode(bytes);
  const value = JSON.parse(decoded) as unknown;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("JWT section is not a JSON object.");
  }
  return value as JwtObject;
}

function parseJwt(token: string) {
  if (!token.trim()) return { state: "empty" as const };
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return {
      state: "invalid" as const,
      error: "A JWT must contain three sections separated by dots.",
    };
  }
  try {
    return {
      state: "valid" as const,
      header: decodePart(parts[0]),
      payload: decodePart(parts[1]),
      signature: parts[2],
    };
  } catch (error) {
    return {
      state: "invalid" as const,
      error: error instanceof Error ? error.message : "Invalid JWT",
    };
  }
}

function formatDate(value: unknown, locale: "en" | "zh") {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value * 1000));
}

function JsonPanel({
  title,
  value,
  copyLabel,
  copiedLabel,
  onCopy,
  copied,
}: {
  title: string;
  value: unknown;
  copyLabel: string;
  copiedLabel: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs text-slate-400 transition hover:text-white"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-6 text-slate-300">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

export default function JwtDecoder({
  locale = "en",
}: {
  locale?: "en" | "zh";
}) {
  const t = copy[locale];
  const [token, setToken] = useState(SAMPLE);
  const [copied, setCopied] = useState("");
  const [openedAt] = useState(() => Date.now());
  const result = useMemo(() => parseJwt(token), [token]);

  async function copyValue(name: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(name);
    window.setTimeout(() => setCopied(""), 1400);
  }

  function downloadPayload() {
    if (result.state !== "valid") return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(result.payload, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "jwt-payload.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const claims =
    result.state === "valid"
      ? [
          [t.issued, formatDate(result.payload.iat, locale)],
          [t.notBefore, formatDate(result.payload.nbf, locale)],
          [t.expires, formatDate(result.payload.exp, locale)],
        ].filter((item): item is [string, string] => Boolean(item[1]))
      : [];
  const expiration =
    result.state === "valid" && typeof result.payload.exp === "number"
      ? result.payload.exp * 1000 < openedAt
        ? t.expired
        : t.active
      : t.noExpiry;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-violet-950/20 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            onClick={() => setToken(SAMPLE)}
          >
            {t.sample}
          </button>
          <button type="button" className="tool-button" onClick={() => setToken("")}>
            {t.clear}
          </button>
        </div>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.local}
        </span>
      </div>

      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-medium">{t.token}</span>
            <span
              className={`text-xs ${
                result.state === "valid"
                  ? "text-emerald-300"
                  : result.state === "invalid"
                    ? "text-rose-300"
                    : "text-slate-500"
              }`}
            >
              {result.state === "valid"
                ? t.valid
                : result.state === "invalid"
                  ? t.invalid
                  : t.waiting}
            </span>
          </div>
          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            spellCheck={false}
            aria-label={t.token}
            placeholder={t.placeholder}
            className="h-72 w-full resize-y break-all bg-transparent p-5 font-mono text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700 lg:h-[540px]"
          />
        </section>

        <section className="min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">{t.decoded}</h2>
            <button
              type="button"
              disabled={result.state !== "valid"}
              onClick={downloadPayload}
              className="tool-button"
            >
              {t.download}
            </button>
          </div>

          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
            <p className="text-sm font-semibold text-amber-300">{t.notVerified}</p>
            <p className="mt-1 text-xs leading-5 text-amber-100/60">{t.warning}</p>
          </div>

          {result.state === "valid" ? (
            <div className="space-y-4">
              {claims.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {claims.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                    >
                      <p className="text-[10px] uppercase tracking-wide text-slate-600">
                        {label}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`rounded-xl border px-3 py-2 text-xs ${
                  expiration === t.expired
                    ? "border-rose-400/20 bg-rose-400/5 text-rose-300"
                    : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                }`}
              >
                {expiration}
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <JsonPanel
                  title={t.header}
                  value={result.header}
                  copyLabel={t.copy}
                  copiedLabel={t.copied}
                  copied={copied === "header"}
                  onCopy={() =>
                    copyValue("header", JSON.stringify(result.header, null, 2))
                  }
                />
                <JsonPanel
                  title={t.payload}
                  value={result.payload}
                  copyLabel={t.copy}
                  copiedLabel={t.copied}
                  copied={copied === "payload"}
                  onCopy={() =>
                    copyValue("payload", JSON.stringify(result.payload, null, 2))
                  }
                />
              </div>
              <JsonPanel
                title={t.signature}
                value={result.signature || "—"}
                copyLabel={t.copy}
                copiedLabel={t.copied}
                copied={copied === "signature"}
                onCopy={() => copyValue("signature", result.signature)}
              />
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-5 text-sm ${
                result.state === "invalid"
                  ? "border-rose-400/20 bg-rose-400/5 text-rose-300"
                  : "border-white/10 text-slate-500"
              }`}
            >
              {result.state === "invalid" ? result.error : t.waiting}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
