import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
export const metadata: Metadata = { title: "About", description: "Learn why Practical Tool Lab builds fast, private tools for real work.", alternates: { canonical: "/about", languages: { en: "/about", "zh-CN": "/zh/about" } } };
export default function Page() { return <InfoPage locale="en" type="about" />; }
