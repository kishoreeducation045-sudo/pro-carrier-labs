import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProCareerLabs | AI-Powered Education Platform",
  description:
    "Learn AI, LinkedIn Growth, and Career Skills with Neeraj Kumar. Join 12,000+ professionals who have transformed their careers with ProCareerLabs.",
  keywords: ["AI Masterclass", "LinkedIn growth", "career coaching", "Neeraj Kumar", "ProCareerLabs"],
  openGraph: {
    title: "ProCareerLabs | AI-Powered Education Platform",
    description: "Learn AI, LinkedIn Growth, and Career Skills with Neeraj Kumar.",
    url: "https://procareerlabs.com",
    siteName: "ProCareerLabs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
