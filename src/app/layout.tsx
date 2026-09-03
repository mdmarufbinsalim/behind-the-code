import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Behind the Code — Md. Maruf Bin Salim",
  description:
    "A look behind the code: systems I've built, problems I've solved, things I've broken, and lessons learned along the way.",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
