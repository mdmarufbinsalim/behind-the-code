import type { Metadata } from "next";
import Script from "next/script";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

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
    <html lang="en" className="h-full">
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
