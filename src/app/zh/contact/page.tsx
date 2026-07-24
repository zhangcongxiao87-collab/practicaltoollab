import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
export const metadata: Metadata = { title: "联系我们", description: "向 Practical Tool Lab 报告问题或建议功能。", alternates: { canonical: "/zh/contact", languages: { en: "/contact", "zh-CN": "/zh/contact" } } };
export default function Page() { return <InfoPage locale="zh" type="contact" />; }
