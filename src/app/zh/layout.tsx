import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Practical Tool Lab - 免费在线开发者工具",
    template: "%s | Practical Tool Lab",
  },
  description: "快速、实用、注重隐私的免费在线开发者与运维工具。",
};

export default function ChineseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div lang="zh-CN">{children}</div>;
}
