import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
export const metadata: Metadata = { title: "隐私政策", description: "了解 Practical Tool Lab 如何处理工具输入和匿名访问数据。", alternates: { canonical: "/zh/privacy", languages: { en: "/privacy", "zh-CN": "/zh/privacy" } } };
export default function Page() { return <InfoPage locale="zh" type="privacy" />; }
