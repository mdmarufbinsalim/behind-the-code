"use client";

import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo-black.svg" alt="Behind the Code" width={28} height={28} />
        <span className="font-hand text-xl">Behind the Code</span>
      </Link>
      <nav className="hidden gap-6 text-sm sm:flex">
        <a href="/#work" className="hover:opacity-60">
          Work
        </a>
        <a href="/#experience" className="hover:opacity-60">
          Experience
        </a>
        <a href="/#about" className="hover:opacity-60">
          About
        </a>
      </nav>
    </header>
  );
}
