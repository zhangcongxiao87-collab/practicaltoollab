import ToolsDirectory from "@/components/ToolsDirectory";

export default function ChineseToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<ToolsDirectory locale="zh" /></>;
}
