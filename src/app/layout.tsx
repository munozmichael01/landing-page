import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from './providers/SessionProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobOptimizer - AI-Powered Job Distribution Platform",
  description: "Automate and optimize your job posting campaigns with AI. Distribute to multiple job boards, optimize budget automatically, maximize applications with lower CPA.",
  keywords: "job distribution, AI optimization, job boards, recruitment marketing, CPA optimization, staffing technology",
  authors: [{ name: "JobOptimizer Team" }],
  openGraph: {
    title: "JobOptimizer - AI-Powered Job Distribution Platform",
    description: "Automate and optimize your job posting campaigns with AI",
    type: "website",
    siteName: "JobOptimizer",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobOptimizer - AI-Powered Job Distribution Platform",
    description: "Automate and optimize your job posting campaigns with AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-white`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
