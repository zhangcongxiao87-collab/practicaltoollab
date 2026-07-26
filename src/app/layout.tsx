import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.practicaltoollab.com"),
  title: "Practical Tool Lab",
  description: "Free online tools for everyday tasks.",
  openGraph: {
    title: "Practical Tool Lab",
    description: "Fast, private, browser-based developer tools.",
    url: "/",
    siteName: "Practical Tool Lab",
    images: [{ url: "/og.png", width: 1536, height: 908 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Practical Tool Lab",
    description: "Fast, private, browser-based developer tools.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
