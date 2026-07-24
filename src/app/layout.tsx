import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
