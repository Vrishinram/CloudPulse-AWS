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
  title: "AWS re/Start Knowledge Check Prep | Interactive Practice Hub",
  description:
    "Master AWS re/Start Knowledge Checks (KCs) with real exam-grade MCQs across Cloud Foundations, Linux, Networking, Python, Databases, Architecture, and Exam Prep.",
  keywords: [
    "AWS re/Start",
    "Knowledge Checks",
    "AWS Cloud Practitioner",
    "AWS Practice Questions",
    "Linux",
    "Networking",
    "Python",
    "Databases",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
