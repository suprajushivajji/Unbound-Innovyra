import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteBackground } from "@/components/site-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innovyra — Smart Career Execution Engine",
  description:
    "From Career Goal → Real Execution → Measurable Growth. Search Less. Execute Smarter.",
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
      <body className="min-h-full flex flex-col bg-[var(--bg-0)] text-[var(--foreground)] selection:bg-[rgba(139,92,246,0.35)] selection:text-white">
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
