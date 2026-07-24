import type { Metadata } from "next";
import CidrCalculator from "@/components/CidrCalculator";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "CIDR 与 IPv4 子网计算器",
  description: "计算网络地址、广播地址、子网掩码、主机范围并拆分 CIDR 网段。",
  alternates: {
    canonical: "/zh/tools/cidr-calculator",
    languages: {
      en: "/tools/cidr-calculator",
      "zh-CN": "/zh/tools/cidr-calculator",
    },
  },
};

export default function ChineseCidrPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SiteHeader
          locale="zh"
          switchHref="/tools/cidr-calculator"
          badge="IPv4"
        />
        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-emerald-400">
            网络工具 / 子网划分
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            CIDR 与子网<span className="text-slate-500">计算器</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            根据 IPv4 地址和前缀生成完整的网络规划，并继续拆分成更小的子网。
          </p>
        </header>
        <CidrCalculator />
      </div>
    </main>
  );
}
