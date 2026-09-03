import type { Metadata } from "next";
import { Caveat, Kalam } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const kalam = Kalam({
  variable: "--font-hand-alt",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Behind the Code — Md. Maruf Bin Salim",
  description:
    "A look behind the code: systems I've built, problems I've solved, things I've broken, and lessons learned along the way.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${caveat.variable} ${kalam.variable}`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
