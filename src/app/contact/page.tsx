import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
export const metadata: Metadata = { title: "Contact", description: "Report a problem or suggest a feature for Practical Tool Lab.", alternates: { canonical: "/contact", languages: { en: "/contact", "zh-CN": "/zh/contact" } } };
export default function Page() { return <InfoPage locale="en" type="contact" />; }
