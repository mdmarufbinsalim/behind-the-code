import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Image
        src="/logo-black.svg"
        alt="Behind The Code"
        width={120}
        height={120}
        priority
        className="dark:hidden"
      />
      <Image
        src="/logo-white.svg"
        alt="Behind The Code"
        width={120}
        height={120}
        priority
        className="hidden dark:block"
      />
    </div>
  );
}
