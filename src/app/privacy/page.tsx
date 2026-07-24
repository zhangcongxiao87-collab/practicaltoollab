import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
export const metadata: Metadata = { title: "Privacy Policy", description: "How Practical Tool Lab processes tool input and anonymous traffic data.", alternates: { canonical: "/privacy", languages: { en: "/privacy", "zh-CN": "/zh/privacy" } } };
export default function Page() { return <InfoPage locale="en" type="privacy" />; }
