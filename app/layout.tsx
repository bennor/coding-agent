import { GeistMono, GeistSans } from "geist/font";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coding Agent",
  description: "A Next.js frontend for the coding agent API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-geist-sans antialiased">{children}</body>
    </html>
  );
}
