import type { Metadata } from "next";
import { Caveat, Kalam } from "next/font/google";
import Script from "next/script";
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

// Light mode is the default regardless of OS preference — dark mode is
// opt-in only, via the toggle, remembered in localStorage.
const themeInitScript = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${caveat.variable} ${kalam.variable}`}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
