import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Image src="/logo.svg" alt="Behind The Code" width={120} height={120} priority />
    </div>
  );
}
