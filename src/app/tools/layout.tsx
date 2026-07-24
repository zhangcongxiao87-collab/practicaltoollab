import ToolsDirectory from "@/components/ToolsDirectory";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<ToolsDirectory locale="en" /></>;
}
