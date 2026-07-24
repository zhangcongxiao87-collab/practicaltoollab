"use client";

import { useMemo, useState } from "react";

const MAX_IPV4 = 2 ** 32;

function parseIpv4(value: string) {
  const parts = value.trim().split(".");
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (
    octets.some(
      (part, index) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255 ||
        String(part) !== parts[index],
    )
  ) {
    return null;
  }
  return (
    octets[0] * 2 ** 24 +
    octets[1] * 2 ** 16 +
    octets[2] * 2 ** 8 +
    octets[3]
  );
}

function numberToIpv4(value: number) {
  const normalized = ((value % MAX_IPV4) + MAX_IPV4) % MAX_IPV4;
  return [
    Math.floor(normalized / 2 ** 24),
    Math.floor((normalized % 2 ** 24) / 2 ** 16),
    Math.floor((normalized % 2 ** 16) / 2 ** 8),
    normalized % 2 ** 8,
  ].join(".");
}

function calculateNetwork(ip: number, prefix: number) {
  const totalAddresses = 2 ** (32 - prefix);
  const network = Math.floor(ip / totalAddresses) * totalAddresses;
  const broadcast = network + totalAddresses - 1;
  const maskNumber =
    prefix === 0 ? 0 : MAX_IPV4 - 2 ** (32 - prefix);
  const wildcard = MAX_IPV4 - 1 - maskNumber;
  const firstUsable = prefix >= 31 ? network : network + 1;
  const lastUsable = prefix === 32 ? network : prefix === 31 ? broadcast : broadcast - 1;
  const usableHosts =
    prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, totalAddresses - 2);

  return {
    network,
    broadcast,
    mask: numberToIpv4(maskNumber),
    wildcard: numberToIpv4(wildcard),
    firstUsable,
    lastUsable,
    totalAddresses,
    usableHosts,
  };
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function CidrCalculator() {
  const [ipInput, setIpInput] = useState("192.168.1.42");
  const [prefix, setPrefix] = useState(24);
  const [splitPrefix, setSplitPrefix] = useState(26);
  const [copied, setCopied] = useState("");

  const ipNumber = useMemo(() => parseIpv4(ipInput), [ipInput]);
  const network = useMemo(
    () => (ipNumber === null ? null : calculateNetwork(ipNumber, prefix)),
    [ipNumber, prefix],
  );
  const effectiveSplitPrefix = Math.max(prefix, splitPrefix);
  const subnets = useMemo(() => {
    if (!network) return [];
    const subnetSize = 2 ** (32 - effectiveSplitPrefix);
    const count = 2 ** (effectiveSplitPrefix - prefix);
    return Array.from({ length: Math.min(count, 8) }, (_, index) => {
      const start = network.network + index * subnetSize;
      return {
        cidr: `${numberToIpv4(start)}/${effectiveSplitPrefix}`,
        range: `${numberToIpv4(start)} – ${numberToIpv4(start + subnetSize - 1)}`,
      };
    });
  }, [effectiveSplitPrefix, network, prefix]);

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1400);
  }

  const results = network
    ? [
        ["Network", `${numberToIpv4(network.network)}/${prefix}`],
        ["Broadcast", numberToIpv4(network.broadcast)],
        ["Subnet mask", network.mask],
        ["Wildcard mask", network.wildcard],
        ["First usable", numberToIpv4(network.firstUsable)],
        ["Last usable", numberToIpv4(network.lastUsable)],
      ]
    : [];

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-950/10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
            <label
              htmlFor="ip-address"
              className="text-xs font-medium uppercase tracking-wider text-slate-500"
            >
              IPv4 address
            </label>
            <div className="mt-3 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950 focus-within:border-emerald-400/50">
              <input
                id="ip-address"
                value={ipInput}
                onChange={(event) => setIpInput(event.target.value)}
                inputMode="decimal"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent px-4 py-4 font-mono text-lg text-white outline-none placeholder:text-slate-700"
                placeholder="192.168.1.42"
              />
              <div className="flex items-center border-l border-white/10 px-4 font-mono text-lg text-emerald-300">
                /{prefix}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <label htmlFor="prefix" className="text-sm text-slate-400">
                Prefix length
              </label>
              <span className="font-mono text-sm text-white">/{prefix}</span>
            </div>
            <input
              id="prefix"
              type="range"
              min="0"
              max="32"
              value={prefix}
              onChange={(event) => {
                const nextPrefix = Number(event.target.value);
                setPrefix(nextPrefix);
                setSplitPrefix((current) => Math.max(current, nextPrefix));
              }}
              className="mt-3 w-full accent-emerald-400"
            />
            <div className="mt-4 grid grid-cols-6 gap-2">
              {[8, 16, 24, 28, 30, 32].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setPrefix(preset);
                    setSplitPrefix(Math.max(splitPrefix, preset));
                  }}
                  className={`rounded-lg border py-2 font-mono text-xs transition ${
                    prefix === preset
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-500 hover:text-white"
                  }`}
                >
                  /{preset}
                </button>
              ))}
            </div>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs text-slate-600">
                <span>Network bits</span>
                <span>Host bits</span>
              </div>
              <div className="grid grid-cols-[repeat(32,minmax(0,1fr))] gap-0.5">
                {Array.from({ length: 32 }, (_, index) => (
                  <span
                    key={index}
                    className={`h-7 rounded-sm ${
                      index < prefix ? "bg-emerald-400" : "bg-slate-800"
                    }`}
                    title={`Bit ${index + 1}: ${index < prefix ? "network" : "host"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {ipNumber === null || !network ? (
              <div className="flex min-h-[390px] items-center justify-center rounded-2xl border border-dashed border-rose-400/20 bg-rose-400/[0.03] text-center">
                <div>
                  <p className="font-medium text-rose-300">Invalid IPv4 address</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Use four numbers between 0 and 255.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  {results.map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => copy(value, label)}
                      className="group rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-left transition hover:border-emerald-400/30"
                    >
                      <span className="block text-xs text-slate-500">{label}</span>
                      <span className="mt-2 block truncate font-mono text-sm text-slate-200 group-hover:text-emerald-300">
                        {copied === label ? "Copied!" : value}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-white/10 p-4">
                    <span className="text-xs text-slate-500">Total addresses</span>
                    <strong className="mt-2 block text-2xl tracking-tight">
                      {formatCount(network.totalAddresses)}
                    </strong>
                  </div>
                  <div className="rounded-2xl border border-white/10 p-4">
                    <span className="text-xs text-slate-500">Usable hosts</span>
                    <strong className="mt-2 block text-2xl tracking-tight text-emerald-300">
                      {formatCount(network.usableHosts)}
                    </strong>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-600">
                  Click any result to copy it. /31 networks are treated as
                  point-to-point links, where both addresses are usable.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {network && (
        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-semibold">Split this network</h2>
              <p className="mt-1 text-sm text-slate-500">
                Preview smaller subnets inside the current range.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-xs text-slate-500">
                <label htmlFor="split-prefix">New prefix</label>
                <span className="font-mono text-white">/{effectiveSplitPrefix}</span>
              </div>
              <input
                id="split-prefix"
                type="range"
                min={prefix}
                max="32"
                value={effectiveSplitPrefix}
                onChange={(event) => setSplitPrefix(Number(event.target.value))}
                className="mt-2 w-full accent-violet-400"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-violet-400/10 px-3 py-1.5 text-violet-300">
              {formatCount(2 ** (effectiveSplitPrefix - prefix))} subnets
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1.5 text-slate-400">
              {formatCount(2 ** (32 - effectiveSplitPrefix))} addresses each
            </span>
          </div>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {subnets.map((subnet) => (
              <button
                key={subnet.cidr}
                type="button"
                onClick={() => copy(subnet.cidr, subnet.cidr)}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left transition hover:border-violet-400/30"
              >
                <span className="font-mono text-sm text-violet-300">
                  {copied === subnet.cidr ? "Copied!" : subnet.cidr}
                </span>
                <span className="truncate text-xs text-slate-600">{subnet.range}</span>
              </button>
            ))}
          </div>
          {2 ** (effectiveSplitPrefix - prefix) > 8 && (
            <p className="mt-4 text-xs text-slate-600">
              Showing the first 8 subnets.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
