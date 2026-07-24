import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
export const metadata: Metadata = { title: "关于我们", description: "了解 Practical Tool Lab 为什么为真实工作开发快速、注重隐私的工具。", alternates: { canonical: "/zh/about", languages: { en: "/about", "zh-CN": "/zh/about" } } };
export default function Page() { return <InfoPage locale="zh" type="about" />; }
